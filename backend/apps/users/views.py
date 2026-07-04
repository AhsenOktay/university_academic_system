from rest_framework import viewsets, generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import JSONParser
from django.db import connection
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import UserSerializer, ChangePasswordSerializer, BASTokenObtainPairSerializer
from django.db.models import Case, When, Value, IntegerField


class LoginView(TokenObtainPairView):
    serializer_class = BASTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        user = self.request.user
        data = self.request.data
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE public.users SET
                    first_name = %s,
                    last_name = %s,
                    profile_image_url = %s,
                    title = %s,
                    faculty = %s,
                    department = %s,
                    update_date = NOW(),
                    updated_by = (SELECT user_id FROM public.user_schemas WHERE schema_name = current_user)
                WHERE id = %s
            """, [
                data.get('first_name', user.first_name),
                data.get('last_name', user.last_name),
                data.get('profile_image_url', user.profile_image_url),
                data.get('title', user.title),
                data.get('faculty', user.faculty),
                data.get('department', user.department),
                user.pk,
            ])


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'detail': 'Mevcut şifre yanlış.'}, status=status.HTTP_400_BAD_REQUEST)
        new_password = serializer.validated_data['new_password']
        from django.contrib.auth.hashers import make_password
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE public.users SET
                    password_hash = %s,
                    update_date = NOW()
                WHERE id = %s
            """, [make_password(new_password), user.pk])
        return Response({'detail': 'Şifre başarıyla değiştirildi.'})


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'department', 'faculty']

    def get_queryset(self):
        title_order = Case(
            When(title='Prof. Dr.', then=Value(1)),
            When(title='Doç. Dr.', then=Value(2)),
            When(title='Dr. Öğr. Üyesi', then=Value(3)),
            When(title='Öğr. Gör.', then=Value(4)),
            When(title='Arş. Gör.', then=Value(5)),
            When(title='Dr.', then=Value(6)),
            default=Value(7),
            output_field=IntegerField()
        )
        queryset = User.objects.filter(is_active=True).annotate(
            title_rank=title_order
        ).order_by('title_rank', 'last_name')
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset


def generate_cv_pdf(user):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    import io

    try:
        pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVu-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
        FONT = 'DejaVu'
        FONT_BOLD = 'DejaVu-Bold'
    except Exception:
        FONT = 'Helvetica'
        FONT_BOLD = 'Helvetica-Bold'

    from apps.publications.models import Publication
    from apps.projects.models import Project
    from apps.theses.models import Thesis
    from apps.awards.models import Award
    from apps.patents.models import Patent
    from apps.events.models import Event
    from apps.courses.models import Course
    from apps.memberships.models import Membership

    publications = Publication.objects.filter(authors=user).order_by('-year')
    projects = (Project.objects.filter(members=user) | Project.objects.filter(owner=user)).distinct().order_by('-start_date')
    theses = Thesis.objects.filter(advisor=user).order_by('-year')
    awards = Award.objects.filter(recipient=user).order_by('-year')
    patents = Patent.objects.filter(inventors=user).order_by('-application_date')
    events = Event.objects.filter(organizer=user).order_by('-start_date')
    courses = Course.objects.filter(instructor=user).order_by('-year')
    memberships = Membership.objects.filter(member=user).order_by('-start_year')

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm)

    story = []
    RED = colors.HexColor('#8B0000')
    GRAY = colors.HexColor('#666666')

    title_style = ParagraphStyle('Title', fontName=FONT_BOLD, fontSize=16, textColor=RED, spaceAfter=8)
    subtitle_style = ParagraphStyle('Subtitle', fontName=FONT, fontSize=11, textColor=GRAY, spaceAfter=2)
    section_style = ParagraphStyle('Section', fontName=FONT_BOLD, fontSize=13, textColor=RED, spaceBefore=16, spaceAfter=6)
    body_style = ParagraphStyle('Body', fontName=FONT, fontSize=10, textColor=colors.black, spaceAfter=4, leading=14)
    small_style = ParagraphStyle('Small', fontName=FONT, fontSize=9, textColor=GRAY, spaceAfter=2)

    full_name = f"{user.title + ' ' if user.title else ''}{user.first_name} {user.last_name}"
    story.append(Paragraph(full_name, title_style))
    if user.department:
        story.append(Paragraph(user.department, subtitle_style))
    if user.faculty:
        story.append(Paragraph(user.faculty, subtitle_style))
    if user.email:
        story.append(Paragraph(user.email, subtitle_style))
    story.append(Spacer(1, 0.3*cm))
    story.append(HRFlowable(width="100%", thickness=2, color=RED))
    story.append(Spacer(1, 0.3*cm))

    def section(title):
        story.append(Paragraph(title, section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
        story.append(Spacer(1, 0.2*cm))

    def p(text, style):
        story.append(Paragraph(str(text) if text else '', style))

    pub_types = {'article': 'Makale', 'book': 'Kitap', 'book_chapter': 'Kitap Bolumu', 'conference': 'Bildiri', 'other': 'Diger'}

    if publications.exists():
        section('Yayinlar')
        for i, pub in enumerate(publications, 1):
            ptype = pub_types.get(pub.pub_type, pub.pub_type)
            p(f"{i}. {pub.title}", body_style)
            info = f"{ptype} - {pub.year}"
            if pub.journal:
                info += f" - {pub.journal}"
            if pub.doi:
                info += f" - DOI: {pub.doi}"
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if projects.exists():
        section('Projeler')
        proj_types = {'tubitak': 'TUBITAK', 'bap': 'BAP', 'eu': 'AB Projesi', 'industry': 'Sanayi', 'other': 'Diger'}
        for i, proj in enumerate(projects, 1):
            p(f"{i}. {proj.title}", body_style)
            info = proj_types.get(proj.project_type, proj.project_type)
            if proj.start_date:
                info += f" - {proj.start_date}"
                if proj.end_date:
                    info += f" / {proj.end_date}"
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if theses.exists():
        section('Danismanlik Yapilan Tezler')
        thesis_types = {'masters': 'Yuksek Lisans', 'phd': 'Doktora'}
        for i, thesis in enumerate(theses, 1):
            p(f"{i}. {thesis.title}", body_style)
            p(f"{thesis_types.get(thesis.thesis_type, '')} - {thesis.year}", small_style)
            story.append(Spacer(1, 0.15*cm))

    if awards.exists():
        section('Oduller')
        for i, award in enumerate(awards, 1):
            p(f"{i}. {award.title}", body_style)
            info = str(award.year)
            if award.given_by:
                info += f" - {award.given_by}"
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if patents.exists():
        section('Patentler')
        for i, patent in enumerate(patents, 1):
            p(f"{i}. {patent.title}", body_style)
            info = ''
            if patent.patent_no:
                info += f"No: {patent.patent_no} - "
            if patent.application_date:
                info += str(patent.application_date)
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if events.exists():
        section('Etkinlikler')
        for i, event in enumerate(events, 1):
            p(f"{i}. {event.title}", body_style)
            info = ''
            if event.location:
                info += f"{event.location} - "
            if event.start_date:
                info += str(event.start_date)
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if courses.exists():
        section('Dersler')
        levels = {'undergraduate': 'Lisans', 'graduate': 'Yuksek Lisans', 'doctorate': 'Doktora'}
        semesters = {'fall': 'Guz', 'spring': 'Bahar', 'summer': 'Yaz'}
        for i, course in enumerate(courses, 1):
            name = f"{course.code + ' - ' if course.code else ''}{course.name}"
            p(f"{i}. {name}", body_style)
            info = f"{levels.get(course.level, '')} - {semesters.get(course.semester, '')} {course.year}"
            if course.credits:
                info += f" - {course.credits} kredi"
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    if memberships.exists():
        section('Uyelikler')
        mem_types = {'association': 'Dernek', 'journal': 'Dergi', 'committee': 'Komite', 'board': 'Yonetim Kurulu', 'other': 'Diger'}
        for i, mem in enumerate(memberships, 1):
            p(f"{i}. {mem.organization}", body_style)
            info = mem_types.get(mem.membership_type, '')
            if mem.role:
                info += f" - {mem.role}"
            info += f" - {mem.start_year}"
            if mem.end_year:
                info += f" / {mem.end_year}"
            p(info, small_style)
            story.append(Spacer(1, 0.15*cm))

    doc.build(story)
    buffer.seek(0)
    return buffer, f"CV_{user.last_name}_{user.first_name}.pdf"


class CVDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        buffer, filename = generate_cv_pdf(user)
        response = HttpResponse(buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class PublicCVDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk, is_active=True)
        buffer, filename = generate_cv_pdf(user)
        response = HttpResponse(buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response