"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    setNotifications((prev) => [...prev, { id, type, message, timestamp }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const success = (message: string) => addNotification("success", message);
  const error = (message: string) => addNotification("error", message);
  const warning = (message: string) => addNotification("warning", message);
  const info = (message: string) => addNotification("info", message);

  return {
    notifications,
    success,
    error,
    warning,
    info,
    removeNotification,
  };
}
