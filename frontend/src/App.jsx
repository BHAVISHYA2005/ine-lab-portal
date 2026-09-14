import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Skeleton from './components/ui/Skeleton.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const LabList = lazy(() => import('./pages/LabList.jsx'));
const LabDetail = lazy(() => import('./pages/LabDetail.jsx'));
const Submissions = lazy(() => import('./pages/Submissions.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RouteFallback() {
  return <main className="page-frame"><Skeleton className="h-48" /></main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="labs" element={<LabList />} />
            <Route path="labs/:id" element={<LabDetail />} />
            <Route path="submissions" element={<Submissions />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
