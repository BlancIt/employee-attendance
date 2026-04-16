import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { App } from 'antd';
import { useAuth } from '../context/AuthContext';

const AdminNotification = () => {
  const { notification } = App.useApp();
  const { user } = useAuth();

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('admin-notification', (data: { message: string; data?: { employeeId: number } }) => {
      if (data.data?.employeeId === user?.id) return;

      notification.info({
        message: 'Employee Update',
        description: data.message,
        placement: 'topRight',
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

export default AdminNotification;