import { useState, useEffect } from 'react';
import { Table, Tag, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../api/axios';
import DateRangeFilter from '../../components/DateRangeFilter';

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

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

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