export interface ScheduleEntry {
  start: string;
  end: string;
  active: boolean;
}

export interface WeeklySchedule {
  monday: ScheduleEntry;
  tuesday: ScheduleEntry;
  wednesday: ScheduleEntry;
  thursday: ScheduleEntry;
  friday: ScheduleEntry;
  saturday: ScheduleEntry;
  sunday: ScheduleEntry;
}

export interface DailySchedule {
  date: string; // ISO date string (YYYY-MM-DD)
  start: string;
  end: string;
  active: boolean;
  notes?: string;
}

export interface LabConfig {
  status: 'open' | 'closed' | 'maintenance';
  specialAlert: string;
  schedule: WeeklySchedule;
  dailySchedules?: { [dateKey: string]: DailySchedule }; // date-indexed daily schedules
  lastUpdate: string;
}

// Legacy User interface for backward compatibility
export interface User {
  uid: string;
  email: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface AdminAction {
  type: 'status_change' | 'schedule_update' | 'alert_update';
  timestamp: string;
  user: string;
  description: string;
}