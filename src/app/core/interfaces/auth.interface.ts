/**
 * Core domain models and DTOs
 * These are shared across the application and define data contracts
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  ownerId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


export interface AuthResponse {
  user: User;
  workspace: Workspace[];
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: string;
  email: string;
  workspaceId: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export type Role = 'admin' | 'member' | 'viewer';

export interface Permission {
  resource: string;
  action: string;
}

export interface WorkspaceRole {
  userId: string;
  workspaceId: string;
  role: Role;
  permissions?: Permission[];
  createdAt: Date;
}
