export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isAllowedNusEmail = (email: string): boolean => {
  const allowedDomains = [
    "@u.nus.edu",
    "@u.duke.nus.edu",
    "@u.yale-nus.edu.sg",
  ];

  return allowedDomains.some((domain) => email.endsWith(domain));
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 15;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};