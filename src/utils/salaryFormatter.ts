export const getCurrencySymbol = (currency: 'USD' | 'INR' | 'EUR' | 'GBP'): string => {
  const symbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£'
  };
  return symbols[currency];
};

export const formatSalaryRange = (
  salaryRange: string | undefined,
  currency: 'USD' | 'INR' | 'EUR' | 'GBP',
  denomination: 'K' | 'L'
): string => {
  if (!salaryRange) return '';
  
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${salaryRange}${denomination}`;
};
