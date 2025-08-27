// Utilidades para mejorar la responsividad de la aplicación

import { useState, useEffect } from "react";

// Breakpoints estándar para diferentes tamaños de pantalla
export const breakpoints = {
  sm: 640, // Móviles pequeños
  md: 768, // Tablets y móviles en horizontal
  lg: 1024, // Laptops y tablets grandes
  xl: 1280, // Desktops
  "2xl": 1536, // Pantallas grandes
};

// Hook personalizado para detectar el tamaño de la pantalla
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Función para actualizar las dimensiones y el breakpoint
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });

      if (width < breakpoints.sm) {
        setBreakpoint("xs");
      } else if (width < breakpoints.md) {
        setBreakpoint("sm");
      } else if (width < breakpoints.lg) {
        setBreakpoint("md");
      } else if (width < breakpoints.xl) {
        setBreakpoint("lg");
      } else if (width < breakpoints["2xl"]) {
        setBreakpoint("xl");
      } else {
        setBreakpoint("2xl");
      }
    };

    // Actualizar dimensiones iniciales
    updateDimensions();

    // Añadir event listener para redimensionamiento
    window.addEventListener("resize", updateDimensions);

    // Limpiar event listener al desmontar
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return { breakpoint, dimensions };
};

// Hook para detectar si la pantalla es móvil
export const useMobile = () => {
  const { breakpoint } = useBreakpoint();
  return ["xs", "sm"].includes(breakpoint);
};

// Hook para detectar si la pantalla es tablet
export const useTablet = () => {
  const { breakpoint } = useBreakpoint();
  return ["md"].includes(breakpoint);
};

// Hook para detectar si la pantalla es desktop
export const useDesktop = () => {
  const { breakpoint } = useBreakpoint();
  return ["lg", "xl", "2xl"].includes(breakpoint);
};

// Componente para renderizado condicional basado en breakpoints
export const Responsive = ({
  children,
  breakpoint: targetBreakpoint,
  mode = "min",
}) => {
  const { breakpoint, dimensions } = useBreakpoint();
  const breakpointValue = breakpoints[targetBreakpoint] || 0;

  if (mode === "min") {
    // Renderizar si la pantalla es mayor o igual al breakpoint
    return dimensions.width >= breakpointValue ? children : null;
  } else if (mode === "max") {
    // Renderizar si la pantalla es menor que el breakpoint
    return dimensions.width < breakpointValue ? children : null;
  } else if (mode === "only") {
    // Renderizar solo si coincide con el breakpoint exacto
    return breakpoint === targetBreakpoint ? children : null;
  }

  return children;
};
