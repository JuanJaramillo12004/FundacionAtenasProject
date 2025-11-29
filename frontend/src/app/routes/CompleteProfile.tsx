import { GenericForm } from "@/components/forms/GenericForm";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { completeGoogleUserSchema } from "@/models/schemas/user.schema";
import { validateClient } from "@/lib/zodUtils";
import { useEffect, useState } from "react";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { createUserInDB } from "@/lib/userHelpers";
import { getErrorMessage, handleValidationError } from "@/lib/errorHandler";
import { PERSONAL_INFO_FIELDS } from "@/constants/formFields";

const ACCOUNT_INFO_FIELDS_NO_EMAIL = {
  username: {
    label: "Nombre de usuario",
    type: "text",
    placeholder: "usuario123",
  },
  phone: {
    label: "Teléfono",
    type: "tel",
    placeholder: "+57 300 123 4567",
  },
};

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const googleUser = location.state?.user;
  const userEmail = location.state?.email;

  useEffect(() => {
    if (!googleUser || !userEmail) {
      toast.error("Sesión inválida");
      navigate("/login");
      return;
    }
    setIsLoading(false);
  }, [googleUser, userEmail, navigate]);

  const steps = [
    {
      title: "Datos personales",
      fields: PERSONAL_INFO_FIELDS,
    },
    {
      title: "Datos de cuenta",
      fields: ACCOUNT_INFO_FIELDS_NO_EMAIL,
    },
  ];

  const handleCompleteProfile = async (data: Record<string, string>) => {
    try {
      const validation = validateClient(completeGoogleUserSchema, {
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

      await createUserInDB(googleUser.id, {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        birthdate: validatedData.birthdate,
        username: validatedData.username,
        phone: validatedData.phone,
        email: userEmail,
      });

      toast.success("¡Perfil completado!", {
        description: "Bienvenido a Fundación Atenas",
      });

      setTimeout(() => {
        navigate("/app");
      }, 500);
    } catch (error) {
      toast.error("Error al completar el perfil", {
        description: getErrorMessage(error),
      });
    }
  };

  if (isLoading) {
    return <FullScreenLoader message="Cargando..." />;
  }

  return (
    <GenericForm
      title="Completa tu perfil"
      description="Necesitamos algunos datos adicionales"
      steps={steps}
      onSubmit={handleCompleteProfile}
    />
  );
}
