import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const MOSCOW_TIMEZONE = 'Europe/Moscow';

dayjs.tz.setDefault(MOSCOW_TIMEZONE);

export const dateUtils = {
  countdown: (date: string) => {
    const difference = dayjs.tz(date).diff(dayjs().tz());

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (difference > 0) {
      return `${days}:${hours}:${minutes}:${seconds}`;
    }
  },

  format: (date?: string | number | Dayjs | Date, format = 'YYYY-MM-DD') =>
    dayjs(date).format(format),

  formatUnix: (timestamp: number | string, format = 'hh:mm:ss') => {
    const date = dayjs.unix(Number(timestamp));

    return date.format(format);
  },

  startOfYesterday: dayjs(dayjs()).startOf('date').subtract(1, 'day').unix(),

  isBeforeNow: (date: number | string) => dayjs(date).isBefore(dayjs()),
  isAfterNow: (date: number | string) => dayjs(date).isAfter(dayjs()),

  addSeconds: (seconds: number) => dayjs().add(seconds, 'second'),

  after: (
    from: string | number | Date | Dayjs,
    to: string | number | Date | Dayjs
  ) => dayjs(from).isAfter(to)
};
