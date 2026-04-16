import { useState, useEffect } from 'react';
import { Card, Button, Typography, App, Tag, Spin } from 'antd';
import { LoginOutlined, LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../../api/axios';

const { Title, Text } = Typography;

const AttendancePage = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { message } = App.useApp();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check today's attendance status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/attendances/me?from=${today}&to=${today}`);
        const records = response.data;

        if (records.length > 0) {
            const todayRecord = records[0];
            if (todayRecord.clocked_in) {
                setClockedIn(true);
                setClockInTime(new Date(todayRecord.clocked_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
            }
            if (todayRecord.clocked_out) {
                setClockedOut(true);
                setClockOutTime(new Date(todayRecord.clocked_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
            }
        }
      } catch (error) {
        // no records yet, that's fine
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleClockIn = async () => {
    setSubmitting(true);
    try {
      await api.post('/attendances/clock-in');
      message.success('Clocked in successfully!');
      setClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    setSubmitting(true);
    try {
      await api.post('/attendances/clock-out');
      message.success('Clocked out successfully!');
      setClockedOut(true);
      setClockOutTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Card style={{ textAlign: 'center' }}>
        
        {/* Live Clock */}
        <ClockCircleOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
        <Title level={2} style={{ margin: 0 }}>
          {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Title>
        <Text type="secondary">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>

        {/* Status */}
        <div style={{ margin: '24px 0' }}>
          {!clockedIn && !clockedOut && (
            <Tag color="default" style={{ fontSize: 14, padding: '4px 12px' }}>
              You have not clocked in
            </Tag>
          )}
          {clockedIn && !clockedOut && (
            <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
              You have already clocked in
            </Tag>
          )}
          {clockedIn && clockedOut && (
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              You have already clocked out
            </Tag>
          )}
        </div>
        
        {/* Counter to show Clock in/out times */}
       <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center', gap: 32 }}>
        <div>
            <Text type="secondary">Clock In</Text>
            <br />
            <Text strong style={{ fontSize: 18 }}>{clockInTime || '--:--'}</Text>
        </div>
        <div>
            <Text type="secondary">Clock Out</Text>
            <br />
            <Text strong style={{ fontSize: 18 }}>{clockOutTime || '--:--'}</Text>
        </div>
       </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={handleClockIn}
            loading={submitting}
            disabled={clockedIn}
            style={{ minWidth: 120 }}
          >
            Clock In
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            icon={<LogoutOutlined />}
            onClick={handleClockOut}
            loading={submitting}
            disabled={!clockedIn || clockedOut}
            style={{ minWidth: 120 }}
          >
            Clock Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AttendancePage;