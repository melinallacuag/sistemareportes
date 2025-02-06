import axios from "axios";

// Configurar la instancia de Axios
const api = axios.create({
  baseURL: "http://192.168.18.21:5001/APIGR", // Reemplaza con tu URL base de la API
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Puedes configurar interceptores si necesitas manejar tokens o errores
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si es necesario
    const token = localStorage.getItem("token"); // Ejemplo de uso del token desde localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
