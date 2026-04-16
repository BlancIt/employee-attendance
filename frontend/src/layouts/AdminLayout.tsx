import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Dropdown, Drawer, Grid } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import AdminNotification from '../components/AdminNotification';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.lg;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/admin/employees',
      icon: <TeamOutlined />,
      label: 'Employee Management',
    },
    {
      key: '/admin/attendance',
      icon: <CalendarOutlined />,
      label: 'Attendance Monitoring',
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/admin/profile',
      icon: <UserOutlined />,
      label: 'User Profile',
    },
    {
      key: '/admin/my-attendance',
      icon: <ClockCircleOutlined />,
      label: 'Attendance',
    },
    {
      key: '/admin/my-attendance-summary',
      icon: <FileTextOutlined />,
      label: 'Attendance Summary',
    },
  ];

  const dropdownItems = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key);
        if (isMobile) setDrawerOpen(false);
      }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{ background: '#fff' }}
        >
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text strong>{collapsed ? 'Admin' : 'Admin Panel'}</Text>
          </div>
          {menuContent}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={250}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text strong>Admin Panel</Text>
          </div>
          {menuContent}
        </Drawer>
      )}

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Button
            type="text"
            icon={isMobile ? <MenuOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
          />
          <Dropdown menu={dropdownItems}>
            <Button type="text" icon={<UserOutlined />}>
              {user?.name} (Admin)
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ margin: isMobile ? 12 : 24, padding: isMobile ? 16 : 24, background: '#fff', borderRadius: 8 }}>
          <AdminNotification />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;