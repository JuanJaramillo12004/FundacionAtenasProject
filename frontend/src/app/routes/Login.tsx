import { GenericForm } from "@/components/forms/GenericForm";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { client } from "@/api/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showResetForm, setShowResetForm] = useState(false);

  const loginFields = {
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

  const handleLogin = async (data: Record<string, string>) => {
    try {
      const { error: authError } = await client.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast.error("Error de autenticación", {
          description: authError.message,
        });
        console.error("Error de autenticación:", authError.message);
        return;
      }

      toast.success("Inicio de sesión exitoso", {
        description: "¡Bienvenido de nuevo!",
      });

      // Login exitoso, redirigir
      navigate("/app");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error inesperado al iniciar sesión";
      toast.error("Error inesperado", {
        description: errorMessage,
      });
    }
  };

  if (showResetForm) {
    return <ResetPasswordForm onCancel={() => setShowResetForm(false)} />;
  }

  return (
    <GenericForm
      title="Fundación Atenas"
      description="Accede a tu cuenta"
      fields={loginFields}
      onSubmit={handleLogin}
      onForgotPassword={() => setShowResetForm(true)}
    />
  );
}
