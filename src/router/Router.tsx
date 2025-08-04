import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { PublicDashboard } from '../pages/PublicDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - accessible to everyone */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <PublicDashboard />
            </PublicRoute>
          } 
        />
        
        {/* Private admin route - requires authentication and admin role */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute requiredRole="administrador">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Fallback route - redirect to home */}
        <Route 
          path="*" 
          element={
            <PublicRoute>
              <PublicDashboard />
            </PublicRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}