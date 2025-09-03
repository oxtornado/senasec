import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/login/", {
      email,
      password,
    });

    const { access, user } = response.data;

    localStorage.setItem("token", access);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    throw new Error("Credenciales inválidas");
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};
