export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface JwtAdminPayload {
  id: number;
  username: string;
  role: string;
}