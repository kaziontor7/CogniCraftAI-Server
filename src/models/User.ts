import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'instructor' | 'admin';
  image?: string;
  bio?: string;
  targetRole?: string;
  skills?: string[];
  enrolledCourseIds?: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    image: { type: String },
    bio: { type: String },
    targetRole: { type: String, default: 'AI Systems Engineer' },
    skills: [{ type: String }],
    enrolledCourseIds: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
