import { Card, DatePicker } from 'antd';
import { Dayjs } from 'dayjs';

interface DateRangeFilterProps {
  dateRange: [Dayjs, Dayjs];
  onChange: (dateRange: [Dayjs, Dayjs]) => void;
}

const DateRangeFilter = ({ dateRange, onChange }: DateRangeFilterProps) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>Filter by Date Range:</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <DatePicker
          value={dateRange[0]}
          onChange={(date) => {
            if (date) onChange([date, dateRange[1]]);
          }}
          format="DD MMM YYYY"
          allowClear={false}
          placeholder="From"
          style={{ flex: 1, minWidth: 140, maxWidth: 200 }}
        />
        <DatePicker
          value={dateRange[1]}
          onChange={(date) => {
            if (date) onChange([dateRange[0], date]);
          }}
          format="DD MMM YYYY"
          allowClear={false}
          placeholder="To"
          style={{ flex: 1, minWidth: 140, maxWidth: 200 }}
        />
      </div>
    </Card>
  );
};

export default DateRangeFilter;