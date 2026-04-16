import { useState, useEffect } from 'react';
import { Table, Tag, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../api/axios';
import DateRangeFilter from '../../components/DateRangeFilter';

const { Title } = Typography;

interface AttendanceRecord {
  date: string;
  clocked_in?: string;
  clocked_out?: string;
}

const AttendanceSummaryPage = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs(),
  ]);

  const fetchAttendance = async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/attendances/me?from=${from}&to=${to}`);
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

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '-';
    return dayjs(timeStr).format('HH:mm:ss');
  };

  const calculateDuration = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return '-';
    const diff = dayjs(clockOut).diff(dayjs(clockIn), 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Clock In',
      dataIndex: 'clocked_in',
      render: (time: string) => formatTime(time),
    },
    {
      title: 'Clock Out',
      dataIndex: 'clocked_out',
      render: (time: string) => formatTime(time),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, record: AttendanceRecord) =>
        calculateDuration(record.clocked_in, record.clocked_out),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: AttendanceRecord) => {
        if (record.clocked_in && record.clocked_out) {
          return <Tag color="green">Complete</Tag>;
        }
        if (record.clocked_in && !record.clocked_out) {
          return <Tag color="orange">In Progress</Tag>;
        }
        return <Tag color="red">Incomplete</Tag>;
      },
    },
  ];

  return (
    <div>
      <Title level={3}>
        <CalendarOutlined /> Attendance Summary
      </Title>
      
      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="date"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 600 }} 
        locale={{ emptyText: 'No attendance records found' }}
      />
    </div>
  );
};

export default AttendanceSummaryPage;