export const composeClasses = (
  ...styles: (string | boolean | undefined)[]
): string => styles.filter((item) => item).join(' ');
