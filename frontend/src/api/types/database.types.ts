export type UserRole = "DONATOR" | "DIRECTOR" | "ADMIN";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  username: string;
  phone: string;
  email: string;
  role: UserRole;
  profile_images_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  username: string;
  phone?: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  username?: string;
  phone?: string;
  profile_images_id?: string;
}

// Tipo para errores de Supabase
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Tipo genérico para respuestas de Supabase
export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}
