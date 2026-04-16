import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Dropdown, Drawer, Grid } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const EmployeeLayout = () => {
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
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: '/attendance',
      icon: <ClockCircleOutlined />,
      label: 'Absen',
    },
    {
      key: '/attendance-summary',
      icon: <FileTextOutlined />,
      label: 'Summary Absen',
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
      {/* Desktop: normal sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ background: '#fff' }}
        >
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text strong>{collapsed ? 'EA' : 'Employee Attendance'}</Text>
          </div>
          {menuContent}
        </Sider>
      )}

      {/* Mobile: drawer sidebar */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={250}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text strong>Employee Attendance</Text>
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
              {user?.name}
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ margin: isMobile ? 12 : 24, padding: isMobile ? 16 : 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;