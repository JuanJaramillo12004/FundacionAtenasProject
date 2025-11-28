import { GenericForm } from "@/components/forms/GenericForm";
import { type FieldConfig } from "@/models/types/forms.type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createUserSchema } from "@/models/schemas/user.schema";
import { validateClient } from "@/lib/zodUtils";
import { authService, userService } from "@/api/services";

export default function Register() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Datos personales",
      fields: {
        first_name: { label: "Nombre", type: "text", placeholder: "Tu nombre" },
        last_name: {
          label: "Apellido",
          type: "text",
          placeholder: "Tu apellido",
        },
        birthdate: {
          label: "Fecha de nacimiento",
          type: "date",
          placeholder: "Tu fecha de nacimiento",
        },
      } as Record<string, FieldConfig>,
    },
    {
      title: "Datos de cuenta",
      fields: {
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
      } as Record<string, FieldConfig>,
    },
    {
      title: "Seguridad",
      fields: {
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "••••••••",
        },
      } as Record<string, FieldConfig>,
    },
  ];

  const handleRegister = async (data: Record<string, string>) => {
    try {
      const validation = validateClient(createUserSchema, {
        ...data,
        role: "DONATOR",
      });

      if (!validation.success) {
        toast.error("Datos inválidos", {
          description: validation.error,
        });
        return;
      }

      if (!validation.data) {
        toast.error("Error en la validación", {
          description: "Los datos validados no están disponibles",
        });
        return;
      }

      const validatedData = validation.data;

      const authData = await authService.signUp(
        validatedData.email,
        validatedData.password,
        {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          birthdate: validatedData.birthdate,
          username: validatedData.username,
          phone: validatedData.phone,
          role: validatedData.role ?? "DONATOR",
          emailRedirectTo: `${window.location.origin}/app`,
        }
      );

      if (authData.user) {
        await userService.create({
          id: authData.user.id,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          birthdate: validatedData.birthdate,
          username: validatedData.username,
          phone: validatedData.phone,
          email: validatedData.email,
          role: validatedData.role ?? "DONATOR",
        });

        if (!authData.session) {
          toast.info("¡Registro exitoso!", {
            description: "Por favor revisa tu correo para confirmar tu cuenta",
            duration: 5000,
          });
          navigate("/login");
          return;
        }

        toast.success("¡Registro exitoso!", {
          description: "Bienvenido a Fundación Atenas",
        });

        setTimeout(() => {
          navigate("/app");
        }, 500);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error inesperado", {
        description: message || "Ocurrió un error inesperado",
      });
    }
  };

  return (
    <GenericForm
      title="Fundación Atenas"
      description="Crea tu cuenta"
      steps={steps}
      onSubmit={handleRegister}
    />
  );
}
