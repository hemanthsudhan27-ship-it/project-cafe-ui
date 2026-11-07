import { User, RegisterPayload, LoginPayload } from '../types/auth';

// ─── Mock delay helper ─────────────────────────────────────────────────────
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Mock user store (in-memory) ───────────────────────────────────────────
const mockUsers: (User & { password: string })[] = [
  {
    id: 'u1',
    name: 'Arjun Kumar',
    email: 'student@college.edu',
    role: 'student',
    department: 'Computer Science',
    phone: '9876543210',
    password: 'password1',
  },
  {
    id: 'u2',
    name: 'Dr. Priya Sharma',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'Mathematics',
    teacherId: 'FAC-2024-001',
    phone: '9876543211',
    password: 'password1',
  },
  {
    id: 'u3',
    name: 'Rahul Verma',
    email: 'guest@example.com',
    role: 'guest',
    password: 'password1',
  },
];

// ─── Stored OTPs (in-memory mock) ──────────────────────────────────────────
const otpStore: Record<string, string> = {};

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Service methods ───────────────────────────────────────────────────────

export const authService = {
  async login({ email, password }: LoginPayload): Promise<User> {
    await delay(800);
    const found = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...user } = found;
    return user;
  },

  async sendLoginOtp(email: string): Promise<void> {
    await delay(600);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email');
    const otp = generateOtp();
    otpStore[email.toLowerCase()] = otp;
    // In production: send via SMTP/SendGrid
    console.log(`[DEV] OTP for ${email}: ${otp}`);
  },

  async verifyLoginOtp(email: string, otp: string): Promise<User> {
    await delay(600);
    const stored = otpStore[email.toLowerCase()];
    // In dev: accept '123456' as universal OTP
    if (otp !== stored && otp !== '123456') {
      throw new Error('Invalid or expired OTP');
    }
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('User not found');
    delete otpStore[email.toLowerCase()];
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async register(payload: RegisterPayload): Promise<void> {
    await delay(1000);
    const exists = mockUsers.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error('An account with this email already exists');
    const newUser = {
      id: `u${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      department: payload.department,
      teacherId: payload.teacherId,
      password: payload.password,
    };
    mockUsers.push(newUser);
    // Send verification OTP
    const otp = generateOtp();
    otpStore[payload.email.toLowerCase()] = otp;
    console.log(`[DEV] Verification OTP for ${payload.email}: ${otp}`);
  },

  async verifyRegistrationOtp(email: string, otp: string): Promise<User> {
    await delay(600);
    const stored = otpStore[email.toLowerCase()];
    if (otp !== stored && otp !== '123456') {
      throw new Error('Invalid or expired OTP');
    }
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('User not found');
    delete otpStore[email.toLowerCase()];
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async sendPasswordResetOtp(email: string): Promise<void> {
    await delay(600);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email');
    const otp = generateOtp();
    otpStore[`reset-${email.toLowerCase()}`] = otp;
    console.log(`[DEV] Password reset OTP for ${email}: ${otp}`);
  },

  async verifyResetOtp(email: string, otp: string): Promise<boolean> {
    await delay(400);
    const stored = otpStore[`reset-${email.toLowerCase()}`];
    if (otp !== stored && otp !== '123456') {
      throw new Error('Invalid or expired OTP');
    }
    return true;
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    await delay(600);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('User not found');
    user.password = newPassword;
    delete otpStore[`reset-${email.toLowerCase()}`];
  },

  async googleSignIn(role?: string): Promise<User> {
    await delay(800);
    // Mock Google sign-in — returns a fake Google user
    return {
      id: `google-${Date.now()}`,
      name: 'Google User',
      email: 'googleuser@gmail.com',
      role: (role as User['role']) || 'student',
    };
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await delay(600);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, updates);
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async resendOtp(email: string): Promise<void> {
    await delay(400);
    const otp = generateOtp();
    otpStore[email.toLowerCase()] = otp;
    console.log(`[DEV] Resent OTP for ${email}: ${otp}`);
  },
};

