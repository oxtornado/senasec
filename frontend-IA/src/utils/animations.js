// Utilidades para animaciones y transiciones en la aplicación

// Duración estándar para las animaciones (en milisegundos)
export const ANIMATION_DURATION = 300;

// Clases CSS para animaciones de entrada y salida
export const fadeIn = {
  enter: "transition-opacity ease-out duration-300",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  leave: "transition-opacity ease-in duration-200",
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0",
};

export const slideInFromRight = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "translate-x-full",
  enterTo: "translate-x-0",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "translate-x-0",
  leaveTo: "translate-x-full",
};

export const slideInFromLeft = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "-translate-x-full",
  enterTo: "translate-x-0",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "translate-x-0",
  leaveTo: "-translate-x-full",
};

export const slideInFromTop = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "-translate-y-full",
  enterTo: "translate-y-0",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "translate-y-0",
  leaveTo: "-translate-y-full",
};

export const slideInFromBottom = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "translate-y-full",
  enterTo: "translate-y-0",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "translate-y-0",
  leaveTo: "translate-y-full",
};

export const scale = {
  enter: "transform transition ease-in-out duration-300",
  enterFrom: "scale-95 opacity-0",
  enterTo: "scale-100 opacity-100",
  leave: "transform transition ease-in-out duration-300",
  leaveFrom: "scale-100 opacity-100",
  leaveTo: "scale-95 opacity-0",
};

// Función para aplicar una animación de entrada
export const animateEntrance = (element, animation = fadeIn) => {
  if (!element) return;

  element.classList.add(animation.enter, animation.enterFrom);

  setTimeout(() => {
    element.classList.remove(animation.enterFrom);
    element.classList.add(animation.enterTo);

    setTimeout(() => {
      element.classList.remove(animation.enter, animation.enterTo);
    }, ANIMATION_DURATION);
  }, 10);
};

// Función para aplicar una animación de salida
export const animateExit = (element, animation = fadeIn, callback) => {
  if (!element) return;

  element.classList.add(animation.leave, animation.leaveFrom);

  setTimeout(() => {
    element.classList.remove(animation.leaveFrom);
    element.classList.add(animation.leaveTo);

    setTimeout(() => {
      element.classList.remove(animation.leave, animation.leaveTo);
      if (callback) callback();
    }, ANIMATION_DURATION);
  }, 10);
};
