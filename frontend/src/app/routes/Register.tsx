import { GenericForm } from "@/components/forms/GenericForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createUserSchema } from "@/models/schemas/user.schema";
import { validateClient } from "@/lib/zodUtils";
import { authService } from "@/api/services";
import { createUserInDB } from "@/lib/userHelpers";
import { getErrorMessage, handleValidationError } from "@/lib/errorHandler";
import { PERSONAL_INFO_FIELDS, ACCOUNT_INFO_FIELDS, PASSWORD_FIELD } from "@/constants/formFields";

export default function Register() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Datos personales",
      fields: PERSONAL_INFO_FIELDS,
    },
    {
      title: "Datos de cuenta",
      fields: ACCOUNT_INFO_FIELDS,
    },
    {
      title: "Seguridad",
      fields: PASSWORD_FIELD,
    },
  ];

  const handleRegister = async (data: Record<string, string>) => {
    try {
      const validation = validateClient(createUserSchema, {
        ...data,
        role: "DONATOR",
      });

      if (!validation.success) {
        handleValidationError(validation.error, toast);
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
          role: "DONATOR",
          emailRedirectTo: `${window.location.origin}/app`,
        }
      );

      if (authData.user) {
        await createUserInDB(authData.user.id, {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          birthdate: validatedData.birthdate,
          username: validatedData.username,
          phone: validatedData.phone,
          email: validatedData.email,
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
      toast.error("Error inesperado", {
        description: getErrorMessage(error),
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
