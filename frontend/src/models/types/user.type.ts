export type UserData = {
  id: string;
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  username?: string;
  phone?: string;
  email?: string;
  role?: string;
  profile_images_id?: string;
};

export type UserWithAuth = UserData & {
  user_metadata?: Record<string, unknown>;
};
