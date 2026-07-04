import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/Home/HomePage.jsx'
import LoginPage from './pages/Login/LoginPage.jsx'
import PublicationsPage from './pages/Publications/PublicationsPage.jsx'
import ProjectsPage from './pages/Projects/ProjectsPage.jsx'
import ResearchersPage from './pages/Researchers/ResearchersPage.jsx'
import ResearchGroupsPage from './pages/ResearchGroups/ResearchGroupsPage.jsx'
import ChangePasswordPage from './pages/ChangePassword/ChangePasswordPage.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import AddPublicationPage from './pages/Publications/AddPublicationPage.jsx'
import AddProjectPage from './pages/Projects/AddProjectPage.jsx'
import AddThesisPage from './pages/Theses/AddThesisPage.jsx'
import AddAwardPage from './pages/Awards/AddAwardPage.jsx'
import AddPatentPage from './pages/Patents/AddPatentPage.jsx'
import ResearcherProfilePage from './pages/Researchers/ResearcherProfilePage.jsx'
import ResearchGroupDetailPage from './pages/ResearchGroups/ResearchGroupDetailPage.jsx'
import EditProfilePage from './pages/Profile/EditProfilePage.jsx'
import AddEventPage from './pages/Events/AddEventPage.jsx'
import AddCoursePage from './pages/Courses/AddCoursePage.jsx'
import AddMembershipPage from './pages/Memberships/AddMembershipPage.jsx'
import EditPublicationPage from './pages/Publications/EditPublicationPage.jsx'
import EditProjectPage from './pages/Projects/EditProjectPage.jsx'
import EditAwardPage from './pages/Awards/EditAwardPage.jsx'
import EditPatentPage from './pages/Patents/EditPatentPage.jsx'
import EditThesisPage from './pages/Theses/EditThesisPage.jsx'
import EditEventPage from './pages/Events/EditEventPage.jsx'
import EditCoursePage from './pages/Courses/EditCoursePage.jsx'
import EditMembershipPage from './pages/Memberships/EditMembershipPage.jsx'
import PublicationDetailPage from './pages/Publications/PublicationDetailPage.jsx'
import ProjectDetailPage from './pages/Projects/ProjectDetailPage.jsx'
import ThesisDetailPage from './pages/Theses/ThesisDetailPage.jsx'
import AwardDetailPage from './pages/Awards/AwardDetailPage.jsx'
import PatentDetailPage from './pages/Patents/PatentDetailPage.jsx'
import EventDetailPage from './pages/Events/EventDetailPage.jsx'
import CourseDetailPage from './pages/Courses/CourseDetailPage.jsx'
import MembershipDetailPage from './pages/Memberships/MembershipDetailPage.jsx'
import AddResearchGroupPage from './pages/ResearchGroups/AddResearchGroupPage.jsx'
import ThesesPage from './pages/Theses/ThesesPage.jsx'
import AwardsPage from './pages/Awards/AwardsPage.jsx'
import PatentsPage from './pages/Patents/PatentsPage.jsx'
import EventsPage from './pages/Events/EventsPage.jsx'
import CoursesPage from './pages/Courses/CoursesPage.jsx'
import MembershipsPage from './pages/Memberships/MembershipsPage.jsx'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/researchers" element={<ResearchersPage />} />
        <Route path="/groups" element={<ResearchGroupsPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/publications/add" element={<AddPublicationPage />} />
        <Route path="/projects/add" element={<AddProjectPage />} />
        <Route path="/theses/add" element={<AddThesisPage />} />
        <Route path="/awards/add" element={<AddAwardPage />} />
        <Route path="/patents/add" element={<AddPatentPage />} />
        <Route path="/researcher/:id" element={<ResearcherProfilePage />} />
        <Route path="/groups/:id" element={<ResearchGroupDetailPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/events/add" element={<AddEventPage />} />
        <Route path="/courses/add" element={<AddCoursePage />} />
        <Route path="/memberships/add" element={<AddMembershipPage />} />
        <Route path="/publications/:id/edit" element={<EditPublicationPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route path="/awards/:id/edit" element={<EditAwardPage />} />
        <Route path="/patents/:id/edit" element={<EditPatentPage />} />
        <Route path="/theses/:id/edit" element={<EditThesisPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
        <Route path="/courses/:id/edit" element={<EditCoursePage />} />
        <Route path="/memberships/:id/edit" element={<EditMembershipPage />} />
        <Route path="/publications/:id" element={<PublicationDetailPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/theses/:id" element={<ThesisDetailPage />} />
        <Route path="/awards/:id" element={<AwardDetailPage />} />
        <Route path="/patents/:id" element={<PatentDetailPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/memberships/:id" element={<MembershipDetailPage />} />
        <Route path="/groups/add" element={<AddResearchGroupPage />} />
        <Route path="/theses" element={<ThesesPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/patents" element={<PatentsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/memberships" element={<MembershipsPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

