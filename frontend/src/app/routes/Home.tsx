import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogIn, UserPlus, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <header className="sticky top-0 z-50 w-full border-b bg-primary backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/55 text-primary-foreground font-bold text-xl shadow-md">
              FA
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-accent">
                Fundación Atenas
              </h1>
              <p className="text-xs text-accent">
                Transformando vidas
              </p>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-secondary/55 hover:bg-secondary/45 text-primary-foreground px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200">
                Soy un Donador
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="pb-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    ¿Ya tienes cuenta?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ingresa con tu correo y contraseña
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="w-full justify-start"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Iniciar Sesión
                </Button>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    ¿Nuevo usuario?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/register")}
                    className="w-full justify-start"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear Cuenta
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground tracking-tight">
              Bienvenido a{" "}
              <span className="text-primary">Fundación Atenas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprometidos con la educación y el desarrollo deportivo de
              nuestra comunidad
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Comienza Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-2 px-8 py-6 text-lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
