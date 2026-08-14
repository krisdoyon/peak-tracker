export const getDisplayDate = (date: string) => {
  const dateObj = new Date(`${date}T00:00:00`);
  const options = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  } as const;
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};
