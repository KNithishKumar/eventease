import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import EventsList from './pages/public/EventsList';
import EventDetail from './pages/public/EventDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyEvents from './pages/student/MyEvents';
import TicketView from './pages/student/TicketView';
import NotificationsPage from './pages/student/NotificationsPage';
import ProfilePage from './pages/student/ProfilePage';
import FeedbackForm from './pages/student/FeedbackForm';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import MyOrganizedEvents from './pages/organizer/MyOrganizedEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import AttendeesList from './pages/organizer/AttendeesList';
import ScannerPage from './pages/organizer/ScannerPage';
import EventAnalytics from './pages/organizer/EventAnalytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import PendingEvents from './pages/admin/PendingEvents';
import ManageUsers from './pages/admin/ManageUsers';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';

const App = () => {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/organizer') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="flex-1 flex">
        {isDashboardRoute && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isDashboardRoute ? 'max-w-7xl' : 'w-full'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-events"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/ticket/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                  <TicketView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/feedback/:eventId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <FeedbackForm />
                </ProtectedRoute>
              }
            />

            {/* Organizer Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <MyOrganizedEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/create"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/attendees"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <AttendeesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/scanner"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <ScannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/analytics"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/notifications"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/pending"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PendingEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PlatformAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
