import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

// Auth
import { AuthProvider } from "@/components/auth/AuthProvider";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import Dashboard from "@/pages/Dashboard";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import ProjectWorkspacePage from "@/pages/ProjectWorkspacePage";
import IntakePage from "@/pages/IntakePage";
import ProposalsPage from "@/pages/ProposalsPage";
import ContractsPage from "@/pages/ContractsPage";
import TasksPage from "@/pages/TasksPage";
import MeetingsPage from "@/pages/MeetingsPage";
import BillingPage from "@/pages/BillingPage";
import AdminPage from "@/pages/AdminPage";
import ProfilePage from "@/pages/ProfilePage";
import MonitoringPage from "@/pages/MonitoringPage";
import NotFoundPage from "@/pages/NotFoundPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/intake" element={<IntakePage />} />
              
              {/* All pages are now public */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/workspace/:id" element={<ProjectWorkspacePage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
