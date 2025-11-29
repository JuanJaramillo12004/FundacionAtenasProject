type ToastFunction = {
  error: (title: string, options?: { description?: string }) => void;
};

// Extrae un mensaje de error legible desde diferentes tipos de errores
export const getErrorMessage = (error: unknown, fallback = "Ocurrió un error inesperado"): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
};

// Maneja errores de autenticación y muestra un toast
export const handleAuthError = (error: unknown, toast: ToastFunction) => {
  const errorMessage = getErrorMessage(error, "Error de autenticación");
  toast.error("Error de autenticación", {
    description: errorMessage,
  });
};

// Maneja errores de validación y muestra un toast
export const handleValidationError = (error: unknown, toast: ToastFunction) => {
  const errorMessage = getErrorMessage(error, "Los datos ingresados no son válidos");
  toast.error("Datos inválidos", {
    description: errorMessage,
  });
};
