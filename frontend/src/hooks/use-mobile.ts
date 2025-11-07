import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Verificar al montar
    checkMobile();

    // Agregar listener para resize
    window.addEventListener("resize", checkMobile);

    // Limpiar listener al desmontar
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
