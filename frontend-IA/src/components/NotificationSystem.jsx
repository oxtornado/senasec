import React, { useState, useEffect, createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Bell, X } from "lucide-react";

// Crear contexto para las notificaciones
const NotificationContext = createContext();

// Proveedor de notificaciones
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();

  // Añadir una nueva notificación
  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-eliminar después de la duración especificada
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  // Eliminar una notificación
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  // Marcar una notificación como leída
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  // Obtener el número de notificaciones no leídas
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications debe ser usado dentro de un NotificationProvider",
    );
  }
  return context;
};

// Componente de icono de notificaciones
export const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, removeNotification } =
    useNotifications();
  const { t } = useTranslation();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t("notifications")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("noNotifications")}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                    notification.read
                      ? "bg-white dark:bg-gray-800"
                      : "bg-blue-50 dark:bg-blue-900"
                  }`}
                >
                  <div className="flex justify-between">
                    <p
                      className={`text-sm ${
                        notification.type === "error"
                          ? "text-red-600 dark:text-red-400"
                          : notification.type === "success"
                          ? "text-green-600 dark:text-green-400"
                          : notification.type === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationProvider;