import { GenericForm } from "@/components/forms/GenericForm";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { authService } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { LOGIN_FIELDS } from "@/constants/formFields";
import { handleAuthError } from "@/lib/errorHandler";

export default function Login() {
  const navigate = useNavigate();
  const [showResetForm, setShowResetForm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (data: Record<string, string>) => {
    try {
      await authService.signIn(data.email, data.password);
      toast.success("Inicio de sesión exitoso", {
        description: "¡Bienvenido de nuevo!",
      });
      navigate("/app");
    } catch (error) {
      handleAuthError(error, toast);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      await authService.signInWithProvider();
    } catch (error) {
      setIsGoogleLoading(false);
      handleAuthError(error, toast);
    }
  };

  if (isGoogleLoading) {
    return <FullScreenLoader message="Redirigiendo a Google..." />;
  }

  if (showResetForm) {
    return <ResetPasswordForm onCancel={() => setShowResetForm(false)} />;
  }

  return (
    <GenericForm
      title="Fundación Atenas"
      description="Accede a tu cuenta"
      fields={LOGIN_FIELDS}
      onSubmit={handleLogin}
      onSubmitWithProvider={handleLoginWithGoogle}
      onForgotPassword={() => setShowResetForm(true)}
    />
  );
}
