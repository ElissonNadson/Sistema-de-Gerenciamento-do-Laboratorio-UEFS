// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requiresAuth?: boolean;
  requiredRole?: 'administrador' | 'professor';
}