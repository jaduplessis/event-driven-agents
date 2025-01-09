export const getBasketDate = (): string => {
  // Deliveries are split week by week. So date is set to the previous Monday at 00:00
  const date = new Date();

  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));

  return monday.toISOString().split("T")[0];
};

console.log(getBasketDate());
