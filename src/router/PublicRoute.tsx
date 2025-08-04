import React from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
}

// Public routes - accessible to everyone without authentication
export function PublicRoute({ children }: PublicRouteProps) {
  return <>{children}</>;
}