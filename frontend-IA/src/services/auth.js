export const login = async (email, password) => {
  const response = await fetch("http://127.0.0.1:8001/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data = await response.json();
  const token = data.access; // token que devuelve DRF JWT

  localStorage.setItem("token", token);
  // Si el backend devuelve info usuario, guardarla
  if (data.user) localStorage.setItem("currentUser", JSON.stringify(data.user));

  return data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};
