import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Progress,
  Form as UIForm,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { FaGoogle } from "react-icons/fa";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { FieldConfig, StepConfig } from "@/models/types/forms.type";

type GenericFormProps = {
  title?: string;
  description?: string;
  fields?: Record<string, FieldConfig>;
  steps?: StepConfig[];
  onSubmit: (data: Record<string, string>) => void;
  onForgotPassword?: () => void;
};

export const GenericForm = ({
  title,
  description,
  fields,
  steps,
  onSubmit,
  onForgotPassword,
}: GenericFormProps) => {
  const methods = useForm();
  const [step, setStep] = useState(0);
  const [datePopoverOpen, setDatePopoverOpen] = useState<Record<string, boolean>>({});

  const totalSteps = steps ? steps.length : 1;
  const currentStep: StepConfig = steps
    ? steps[step]
    : { fields: fields || {} };

  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () =>
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (data: Record<string, string>) => {
    if (steps && step < totalSteps - 1) {
      handleNext();
    } else {
      onSubmit(data);
    }
  };

  const isLoginForm = !steps;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <UIForm {...methods}>
        <div className="w-full max-w-md">
          <Card className="overflow-hidden py-0">
            <CardHeader className="bg-gradient-to-r from-primary to-primary-hover p-6 flex flex-col items-center text-center">
              <CardTitle className="text-background text-2xl font-bold mb-1">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-background">
                  {description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="bg-background px-6 py-8">
              {totalSteps > 1 && <Progress value={progress} className="mb-6" />}

              {steps && currentStep.title && (
                <h2 className="text-lg font-semibold mb-4 text-center">
                  {currentStep.title}
                </h2>
              )}

              <form
                onSubmit={methods.handleSubmit(handleSubmit)}
                className="space-y-5"
              >
                {Object.entries(currentStep.fields).map(([key, config]) => (
                  <FormItem key={key}>
                    <Label htmlFor={key}>{config.label}</Label>
                    {config.type === "date" ? (
                      <Popover 
                        key={`popover-${key}`}
                        open={datePopoverOpen[key] || false}
                        onOpenChange={(open) => 
                          setDatePopoverOpen(prev => ({ ...prev, [key]: open }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !methods.watch(key) && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {methods.watch(key) ? (
                              format(new Date(methods.watch(key)), "PPP", {
                                locale: es,
                              })
                            ) : (
                              <span>
                                {config.placeholder ?? "Selecciona una fecha"}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={
                              methods.watch(key)
                                ? new Date(methods.watch(key))
                                : undefined
                            }
                            onSelect={(date) => {
                              methods.setValue(
                                key,
                                date ? date.toISOString() : ""
                              );
                              setDatePopoverOpen(prev => ({ ...prev, [key]: false }));
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : config.type === "select" ? (
                      <Select
                        value={methods.watch(key)}
                        onValueChange={(value) => methods.setValue(key, value)}
                      >
                        <SelectTrigger id={key} className="w-full">
                          <SelectValue
                            placeholder={
                              config.placeholder ?? "Selecciona una opción"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {config.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={key}
                        type={config.type}
                        placeholder={config.placeholder ?? ""}
                        {...methods.register(key)}
                      />
                    )}
                  </FormItem>
                ))}

                {isLoginForm && (
                  <>
                    <div className="flex items-center justify-between mt-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-input bg-input"
                        />
                        <span>Recordarme</span>
                      </label>
                      {onForgotPassword ? (
                        <button
                          type="button"
                          onClick={onForgotPassword}
                          className="text-sm hover:underline text-primary"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      ) : (
                        <a
                          className="text-sm hover:underline text-primary"
                          href="/reset-password"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  {steps && step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-1/3 "
                    >
                      Atrás
                    </Button>
                  ) : (
                    <div className="w-1/3" />
                  )}

                  {steps ? (
                    step === totalSteps - 1 ? (
                      <Button type="submit" variant="primary" className="w-1/3">
                        Finalizar
                      </Button>
                    ) : (
                      <Button type="submit" variant="primary" className="w-1/3">
                        Siguiente
                      </Button>
                    )
                  ) : (
                    <Button type="submit" variant="primary" className="w-full">
                      Iniciar sesión
                    </Button>
                  )}
                </div>

                {isLoginForm && (
                  <>
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      o continúa con
                    </div>

                    <div className="grid grid-cols-1">
                      <Button variant="outline" className="w-full">
                        <FaGoogle />
                        <span className="text-sm">Google</span>
                      </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-3">
                      ¿No tienes cuenta?{" "}
                      <a className="text-primary" href="/register">
                        Regístrate
                      </a>
                    </p>
                  </>
                )}
                {!isLoginForm && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    ¿Ya tienes cuenta?{" "}
                    <a className="text-primary" href="/login">
                      Inicia sesión
                    </a>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </UIForm>
    </main>
  );
};
