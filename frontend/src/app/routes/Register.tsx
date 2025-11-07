import { GenericForm } from "@/components/forms/GenericForm";
import { type FieldConfig } from "@/models/types/forms.type";
import { client } from "@/api/supabase/client";
import { RawRole } from "@/lib/roles";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
        role: {
          label: "Rol",
          type: "select",
          options: [
            { value: RawRole.ADMIN, label: "Administrador" },
            { value: RawRole.DIRECTOR, label: "Director" },
            { value: RawRole.DONATOR, label: "Donador" },
          ],
        },
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
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            birthdate: data.birthdate,
            username: data.username,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (authError) {
        toast.error("Error al crear usuario", {
          description: authError.message,
        });
        return;
      }

      // Guardar datos adicionales en la base de datos
      const { error: dbError } = await client.from("user").insert([
        {
          id: authData.user?.id,
          first_name: data.first_name,
          last_name: data.last_name,
          birthdate: data.birthdate,
          username: data.username,
          phone: data.phone,
          email: data.email,
          role: data.role,
        },
      ]);

      if (dbError) {
        toast.error("Error al guardar datos adicionales", {
          description: dbError.message,
        });
        return;
      }

      // Hacer login automático
      const { error: loginError } = await client.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        toast.error("Registro exitoso pero error al iniciar sesión", {
          description: "Por favor inicia sesión manualmente",
        });
        navigate("/login");
        return;
      }

      // Mostrar mensaje de éxito y redirigir
      toast.success("¡Registro exitoso!", {
        description: "Bienvenido a Fundación Atenas",
      });

      // Redirigir al dashboard
      setTimeout(() => {
        navigate("/app");
      }, 500);
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
