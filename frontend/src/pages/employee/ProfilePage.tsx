import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Modal, Form, Input, Avatar, Upload, App, Spin } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api/axios';

interface Profile {
  id: number;
  name: string;
  email: string;
  photo_url: string | null;
  position: string;
  phone_number: string | null;
  is_admin: boolean;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneModal, setPhoneModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();
  const [phoneForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/employees/me');
      setProfile(response.data);
    } catch (error) {
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePhoneUpdate = async (values: { phone_number: string }) => {
    setSaving(true);
    try {
      await api.patch('/employees/me', { phone_number: values.phone_number });
      message.success('Phone number updated!');
      setPhoneModal(false);
      phoneForm.resetFields();
      fetchProfile();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update phone');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (values: { oldPassword: string; newPassword: string }) => {
    setSaving(true);
    try {
      await api.post('/employees/me/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed!');
      setPasswordModal(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.patch('/employees/me', { photo_url: reader.result as string });
        message.success('Photo updated!');
        fetchProfile();
      } catch (error) {
        message.error('Failed to update photo');
      }
    };
    reader.readAsDataURL(file);
    return false; // prevent default upload
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Card>
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              src={profile?.photo_url}
            />
            <Upload
              showUploadList={false}
              beforeUpload={handlePhotoUpload}
              accept="image/*"
            >
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: -4,
                }}
              />
            </Upload>
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{profile?.name}</h2>
            <p style={{ margin: 0, color: '#888' }}>{profile?.position}</p>
          </div>
        </div>

        {/* Profile Details */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{profile?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
          <Descriptions.Item label="Position">{profile?.position}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{profile?.phone_number || 'Not set'}</span>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  phoneForm.setFieldsValue({ phone_number: profile?.phone_number });
                  setPhoneModal(true);
                }}
              >
                Edit
              </Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Password">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>••••••••</span>
              <Button
                type="link"
                icon={<LockOutlined />}
                onClick={() => setPasswordModal(true)}
              >
                Change
              </Button>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Edit Phone Modal */}
      <Modal
        title="Edit Phone Number"
        open={phoneModal}
        onCancel={() => setPhoneModal(false)}
        footer={null}
      >
        <Form form={phoneForm} layout="vertical" onFinish={handlePhoneUpdate}>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="08xxxxxxxxxx" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={passwordModal}
        onCancel={() => setPasswordModal(false)}
        footer={null}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;