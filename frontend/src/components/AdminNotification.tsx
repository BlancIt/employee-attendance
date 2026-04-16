import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { App } from 'antd';

const AdminNotification = () => {
  const { notification } = App.useApp();

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('admin-notification', (data: { message: string }) => {
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