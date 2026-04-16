import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../api/axios';

const { Title } = Typography;

interface AttendanceRecord {
  id: number;
  date: string;
  time: string;
  status: string;
  employee: {
    id: number;
    name: string;
    email: string;
  } | null;
}

const AttendanceMonitoringPage = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

  const fetchAttendance = async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/attendances?from=${from}&to=${to}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const from = dateRange[0].format('YYYY-MM-DD');
    const to = dateRange[1].format('YYYY-MM-DD');
    fetchAttendance(from, to);
  }, [dateRange]);

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: AttendanceRecord) => record.employee?.name || '-',
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: any, record: AttendanceRecord) => record.employee?.email || '-',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: (time: string) => dayjs(time).format('HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        if (status === 'clocked_in') {
          return <Tag color="green" style={{ minWidth: 75, textAlign: 'center' }}>Clock In</Tag>;
        }
        if (status === 'clocked_out') {
          return <Tag color="blue" style={{ minWidth: 75, textAlign: 'center' }}>Clock Out</Tag>;
        }
        return <Tag>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        <CalendarOutlined /> Attendance Monitoring
      </Title>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>Filter by Date Range:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <DatePicker
            value={dateRange[0]}
            onChange={(date) => {
              if (date) setDateRange([date, dateRange[1]]);
            }}
            format="DD MMM YYYY"
            allowClear={false}
            placeholder="From"
            style={{ flex: 1, minWidth: 140, maxWidth: 200 }}
          />
          <DatePicker
            value={dateRange[1]}
            onChange={(date) => {
              if (date) setDateRange([dateRange[0], date]);
            }}
            format="DD MMM YYYY"
            allowClear={false}
            placeholder="To"
            style={{ flex: 1, minWidth: 140, maxWidth: 200 }}
          />
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 700 }}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No attendance records found' }}
      />
    </div>
  );
};

export default AttendanceMonitoringPage;