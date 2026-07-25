import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'cognicraft_secret_key_2026_super_secure_jwt_key';

// Demo Credentials for quick 1-click testing
export const DEMO_STUDENT = {
  id: 'demo-student-id-101',
  name: 'Alex Rivera',
  email: 'alex.student@cognicraft.ai',
  role: 'student',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetRole: 'AI Systems Engineer',
  skills: ['React.js', 'TypeScript', 'Node.js'],
  enrolledCourseIds: [],
};

export const DEMO_INSTRUCTOR = {
  id: 'demo-instructor-id-202',
  name: 'Dr. Sarah Vance',
  email: 'sarah.instructor@cognicraft.ai',
  role: 'instructor',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  targetRole: 'Lead AI Architect',
  skills: ['Python', 'Gemini Pro API', 'Distributed Systems', 'PyTorch'],
  enrolledCourseIds: [],
};

// Login Route
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, demoType } = req.body;

    // Handle quick demo login
    if (demoType === 'student') {
      const token = jwt.sign(DEMO_STUDENT, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Logged in as Demo Student',
        user: DEMO_STUDENT,
        token,
      });
    }

    if (demoType === 'instructor') {
      const token = jwt.sign(DEMO_INSTRUCTOR, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Logged in as Demo Instructor',
        user: DEMO_INSTRUCTOR,
        token,
      });
    }

    // Regular Login
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Auto-create user for demo convenience if not exists
      user = new User({
        name: email.split('@')[0],
        email: email.toLowerCase(),
        password,
        role: 'student',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        enrolledCourseIds: [],
      });
      await user.save();
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      enrolledCourseIds: user.enrolledCourseIds || [],
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      user: payload,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register Route
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      enrolledCourseIds: [],
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image,
      enrolledCourseIds: [],
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: payload,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Current Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      user: decoded,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Enroll Course in MongoDB
export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    if (userId && typeof userId === 'string' && !userId.startsWith('demo-')) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.enrolledCourseIds) user.enrolledCourseIds = [];
        if (!user.enrolledCourseIds.includes(courseId)) {
          user.enrolledCourseIds.push(courseId);
          await user.save();
        }
      }
    }

    res.json({ success: true, message: 'Enrolled in course successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Course Enrollment in MongoDB
export const cancelCourseEnrollment = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    if (userId && typeof userId === 'string' && !userId.startsWith('demo-')) {
      const user = await User.findById(userId);
      if (user && user.enrolledCourseIds) {
        user.enrolledCourseIds = user.enrolledCourseIds.filter((id: string) => id !== courseId);
        await user.save();
      }
    }

    res.json({ success: true, message: 'Enrollment canceled successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
