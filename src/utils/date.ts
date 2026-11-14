import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export function dateFormat(dateString?: string, format: string ='YYYY/MM/DD HH:mm:ss') {
  const date = dateString ? dayjs(dateString) : dayjs();
  return date.format(format);
};
