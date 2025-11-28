import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid("ID de usuario inválido"),
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  birthdate: z.string().min(1, "La fecha de nacimiento es requerida"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Número de teléfono inválido")
    .optional(),
  email: z.string().email("Email no válido"),
  role: z.enum(["ADMIN", "DONATOR", "DIRECTOR"], {
    message: "Rol no válido",
  }),
  profile_images_id: z.string().url("URL de avatar inválida").optional(),
});

export const createUserSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  birthdate: z.string().min(1, "La fecha de nacimiento es requerida"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Número de teléfono inválido")
    .optional(),
  email: z.string().email("Email no válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  role: z.enum(["ADMIN", "DONATOR", "DIRECTOR"], {
    message: "Rol no válido",
  }),
});

export const updateUserSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido").optional(),
  last_name: z.string().min(1, "El apellido es requerido").optional(),
  birthdate: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .optional(),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    )
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Número de teléfono inválido")
    .optional(),
  email: z.string().email("Email no válido").optional(),
  role: z
    .enum(["ADMIN", "DONATOR", "DIRECTOR"], {
      message: "Rol no válido",
    })
    .optional(),
  profile_images_id: z.string().url("URL de avatar inválida").optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
