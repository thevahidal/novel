export const formatRelatedDate = (date) => {
  const formatter = new Intl.RelativeTimeFormat('en-US');
  const seconds = Math.round((new Date(date) - new Date()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(minutes) < 1) {
    return formatter.format(seconds, 'second');
  } else if (Math.abs(hours) < 1) {
    return formatter.format(minutes, 'minute');
  } else if (Math.abs(days) < 7) {
    return formatter.format(hours, 'hour');
  } else {
    return formatter.format(days, 'day');
  }
};
