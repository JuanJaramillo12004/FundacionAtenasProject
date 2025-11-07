import { useState } from "react";
import { client } from "@/api/supabase/client";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { toast } from "sonner";

type ResetPasswordFormProps = {
  onCancel: () => void;
};

export const ResetPasswordForm = ({ onCancel }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        toast.error("Por favor ingresa tu correo electrónico");
        return;
      }

      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Correo enviado", {
        description: `Se ha enviado un enlace de recuperación a ${email}`,
      });

      setTimeout(() => {
        onCancel();
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error inesperado";
      toast.error("Error inesperado", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden py-0">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-hover p-6 flex flex-col items-center text-center">
            <CardTitle className="text-background text-2xl font-bold mb-1">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-background">
              Te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-background px-6 py-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleResetPassword}
                  className="flex-1"
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace"}
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
