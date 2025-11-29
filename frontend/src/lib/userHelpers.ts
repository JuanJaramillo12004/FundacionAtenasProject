import { userService } from "@/api/services";
import type { CreateUserData } from "@/api/types/database.types";

// Crea un usuario en la base de datos con el rol DONATOR por defecto
export const createUserInDB = async (
  userId: string,
  userData: Omit<CreateUserData, "id" | "role"> & { role?: string }
): Promise<void> => {
  await userService.create({
    id: userId,
    ...userData,
    role: userData.role ?? "DONATOR",
  } as CreateUserData);
};
