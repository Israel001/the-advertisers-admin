export const composeClasses = (
  ...styles: (string | boolean | undefined)[]
): string => styles.filter((item) => item).join(' ');

export const formatWithNaira = (number: any) => {
  return `⁠₦${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};
