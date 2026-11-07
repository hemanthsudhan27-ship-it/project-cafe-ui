/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validate a password (min 8 chars, at least 1 number)
 */
export function isValidPassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return null;
}

/**
 * Validate a 6-digit OTP
 */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate a name (min 2 chars, letters and spaces only)
 */
export function isValidName(name: string): string | null {
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

/**
 * Validate a phone number (optional — 10 digits if provided)
 */
export function isValidPhone(phone: string): string | null {
  if (!phone) return null; // optional
  if (!/^\d{10}$/.test(phone)) return 'Enter a valid 10-digit phone number';
  return null;
}

