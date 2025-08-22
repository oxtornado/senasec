// Servicio de autenticación mock para desarrollo
// Usuarios de prueba
const mockUsers = {
  'admin': {
    id: 1,
    username: 'admin',
    email: 'admin@senasec.com',
    full_name: 'Administrador SENASEC',
    is_admin: true,
    password: 'admin123'
  },
  'usuario': {
    id: 2,
    username: 'usuario',
    email: 'usuario@senasec.com',
    full_name: 'Usuario Estándar',
    is_admin: false,
    password: 'usuario123'
  }
};

export const login = async (username, password) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers[username.toLowerCase()];
  
  if (!user || user.password !== password) {
    throw new Error('Credenciales inválidas');
  }
  
  // Generar token mock
  const token = `mock_token_${user.id}_${Date.now()}`;
  
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return {
    access_token: token,
    token_type: 'bearer',
    user: user
  };
};

export const register = async (userData) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock de registro exitoso
  return {
    id: Date.now(),
    ...userData,
    is_admin: false
  };
};

export const getCurrentUser = async () => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('currentUser');
  
  if (!token || !storedUser) {
    throw new Error('No hay sesión activa');
  }
  
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    throw new Error('Error al obtener datos del usuario');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};
