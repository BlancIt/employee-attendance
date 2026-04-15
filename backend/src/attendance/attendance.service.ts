import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  // Insert clock in attendance record to database
  async clockIn(employeeId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];

    // Check if user already clocked in today
    const existing = await this.attendanceRepo.findOne({
      where: { employee_id: employeeId, date: today, status: 'clocked_in' },
    });
    if (existing) throw new BadRequestException('You have already clocked in today');

    const attendance = this.attendanceRepo.create({
      employee_id: employeeId,
      date: today,
      time: new Date(),
      status: 'clocked_in',
    });
    return this.attendanceRepo.save(attendance);
  }

  // Insert clock out attendance record to database
  async clockOut(employeeId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];

    // Prevent clocked out if user have yet to clock in
    const clockInRecord = await this.attendanceRepo.findOne({
      where: { employee_id: employeeId, date: today, status: 'clocked_in' },
    });
    if (!clockInRecord) throw new BadRequestException('You have not clocked in today');

    // Check if user already clocked out today
    const existingOut = await this.attendanceRepo.findOne({
      where: { employee_id: employeeId, date: today, status: 'clocked_out' },
    });
    if (existingOut) throw new BadRequestException('You have already clocked out today');

    const attendance = this.attendanceRepo.create({
      employee_id: employeeId,
      date: today,
      time: new Date(),
      status: 'clocked_out',
    });
    return this.attendanceRepo.save(attendance);
  }

  // Get current user attendance record from specific time, grouped by date from old to new
  async getMyAttendance(employeeId: number, from?: string, to?: string): Promise<any[]> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const fromDate = from || startOfMonth;
    const toDate = to || todayStr;

    const records = await this.attendanceRepo.find({
      where: {
        employee_id: employeeId,
        date: Between(fromDate, toDate),
      },
      order: { date: 'ASC', time: 'ASC' },
    });

    const grouped: Record<string, { date: string; clocked_in?: Date; clocked_out?: Date }> = {};
    for (const rec of records) {
      if (!grouped[rec.date]) {
        grouped[rec.date] = { date: rec.date };
      }
      if (rec.status === 'clocked_in') grouped[rec.date].clocked_in = rec.time;
      if (rec.status === 'clocked_out') grouped[rec.date].clocked_out = rec.time;
    }

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get attendance record of all employees
  async getAllAttendance(from?: string, to?: string): Promise<any[]> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const fromDate = from || startOfMonth;
    const toDate = to || todayStr;

    const records = await this.attendanceRepo.find({
      where: {
        date: Between(fromDate, toDate),
      },
      relations: ['employee'],
      order: { date: 'DESC', time: 'DESC' },
    });

    return records.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time,
      status: r.status,
      employee: r.employee
        ? { id: r.employee.id, name: r.employee.name, email: r.employee.email }
        : null,
    }));
  }
}