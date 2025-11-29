import type { FieldConfig } from "@/models/types/forms.type";

// Campos de formulario reutilizables
export const PERSONAL_INFO_FIELDS: Record<string, FieldConfig> = {
  first_name: { label: "Nombre", type: "text", placeholder: "Tu nombre" },
  last_name: { label: "Apellido", type: "text", placeholder: "Tu apellido" },
  birthdate: {
    label: "Fecha de nacimiento",
    type: "date",
    placeholder: "Tu fecha de nacimiento",
  },
};

export const ACCOUNT_INFO_FIELDS: Record<string, FieldConfig> = {
  username: {
    label: "Nombre de usuario",
    type: "text",
    placeholder: "usuario123",
  },
  email: {
    label: "Correo electrónico",
    type: "email",
    placeholder: "tu@ejemplo.com",
  },
  phone: {
    label: "Teléfono",
    type: "tel",
    placeholder: "+57 300 123 4567",
  },
};

export const PASSWORD_FIELD: Record<string, FieldConfig> = {
  password: {
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••",
  },
};

export const LOGIN_FIELDS: Record<string, FieldConfig> = {
  email: {
    label: "Correo electrónico",
    type: "email",
    placeholder: "tu@correo.com",
  },
  password: {
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••",
  },
};
