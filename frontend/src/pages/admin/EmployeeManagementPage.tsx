import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, App, Typography, Grid } from 'antd';
import { PlusOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../../api/axios';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  phone_number: string | null;
  is_admin: boolean;
}

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ is_admin: false });
    setModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditing(employee);
    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone_number: employee.phone_number,
      is_admin: employee.is_admin,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/employees/${editing.id}`, values);
        message.success('Employee updated!');
      } else {
        await api.post('/employees', values);
        message.success('Employee created!');
      }
      setModalOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Admin Access',
      dataIndex: 'is_admin',
      render: (isAdmin: boolean) => (isAdmin ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <Title level={3} style={{ margin: 0 }}>
          <TeamOutlined /> Employee Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Add Employee
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        scroll={{ x: 600 }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? 'Edit Employee' : 'Add New Employee'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={isMobile ? '95%' : 500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" disabled={!!editing} />
          </Form.Item>

          {!editing && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
          )}

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="phone_number" label="Phone Number">
            <Input size="large" placeholder="Optional" />
          </Form.Item>

          <Form.Item name="is_admin" label="Admin Access" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block size="large">
              {editing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagementPage;