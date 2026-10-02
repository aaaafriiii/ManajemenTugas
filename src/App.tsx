import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';

import { MobileFrame } from './components/common/MobileFrame';
import { WebLayout } from './components/common/WebLayout';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';

import { Onboarding } from './components/onboarding/Onboarding';
import { AuthScreen } from './components/auth/AuthScreen';

import { Dashboard } from './components/dashboard/Dashboard';
import { TaskList } from './components/tasks/TaskList';
import { CalendarView } from './components/calendar/CalendarView';
import { StatsView } from './components/stats/StatsView';
import { ProfileView } from './components/profile/ProfileView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { NotificationsView } from './components/notifications/NotificationsView';

import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { TaskFormModal } from './components/forms/TaskFormModal';
import { SubjectFormModal } from './components/subjects/SubjectFormModal';

const MainAppContent: React.FC = () => {
  const { isOnboardingCompleted, isAuthenticated } = useAuth();
  const { activeTab } = useTask();
  const { isMobileFrameEnabled } = useTheme();

  // If user hasn't completed 3-slide onboarding, show Onboarding screen
  if (!isOnboardingCompleted) {
    return <Onboarding />;
  }

  // If user is not authenticated, show Auth screen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const activeView = (
    <>
      <ToastContainer />
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'tasks' && <TaskList />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'stats' && <StatsView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'subjects' && <SubjectsView />}
      {activeTab === 'notifications' && <NotificationsView />}

      {/* Global Interactive Modals */}
      <TaskDetailModal />
      <TaskFormModal />
      <SubjectFormModal />
    </>
  );

  // If mobile phone frame is enabled, render in iPhone simulator shell
  if (isMobileFrameEnabled) {
    return (
      <MobileFrame>
        <Header />
        <main className="min-h-[70vh]">
          {activeView}
        </main>
        <BottomNav />
      </MobileFrame>
    );
  }

  // Otherwise, render as full Web Application layout
  return (
    <WebLayout>
      {activeView}
    </WebLayout>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <MainAppContent />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
