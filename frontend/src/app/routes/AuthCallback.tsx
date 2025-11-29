import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, userService } from "@/api/services";
import { toast } from "sonner";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { handleAuthError } from "@/lib/errorHandler";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const session = await authService.getSession();

        if (!session) {
          toast.error("No se pudo iniciar sesión");
          navigate("/login");
          return;
        }

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await userService.getById(session.user.id);

        if (!existingUser) {
          // Usuario nuevo de Google, redirigir a completar perfil
          toast.info("Completa tu perfil", {
            description: "Necesitamos algunos datos adicionales",
          });
          navigate("/complete-profile", {
            state: {
              user: session.user,
              email: session.user.email,
            },
          });
          return;
        }

        // Usuario existente, redirigir al dashboard
        toast.success("Inicio de sesión exitoso", {
          description: "¡Bienvenido!",
        });
        navigate("/app");
      } catch (error) {
        handleAuthError(error, toast);
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return <FullScreenLoader message="Procesando autenticación con Google..." />;
}
