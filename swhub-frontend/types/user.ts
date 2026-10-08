export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  isActive: boolean;
}
