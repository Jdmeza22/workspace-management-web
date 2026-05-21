export interface Workspace {
  workspaceId: string;
  name: string;
  role: string;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  workspaces: Workspace[];
}

export interface LoginResponse {
  userId: string;
  fullName: string;
  email: string;
  workspaces: Workspace[];
}
export interface GenerateTokenRequest {
  userId: string;
  workspaceId: string;
}

export interface GenerateTokenResponse {
  token: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
