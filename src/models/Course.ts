import mongoose, { Schema, Document } from 'mongoose';

export interface ISyllabusModule {
  title: string;
  duration: string;
  topics: string[];
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  category:
    | 'AI & Machine Learning'
    | 'Full-Stack Engineering'
    | 'Cloud & DevOps'
    | 'Cybersecurity'
    | 'Data Science'
    | 'UI/UX & Product Design'
    | 'Product Management'
    | 'Automation & No-Code Systems';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  tags: string[];
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  syllabus: ISyllabusModule[];
  prerequisites: string[];
  keyOutcomes: string[];
  enrolledStudents: number;
  creatorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        'AI & Machine Learning',
        'Full-Stack Engineering',
        'Cloud & DevOps',
        'Cybersecurity',
        'Data Science',
        'UI/UX & Product Design',
        'Product Management',
        'Automation & No-Code Systems',
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 24 },
    duration: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    instructorName: { type: String, required: true },
    instructorRole: { type: String, required: true },
    instructorAvatar: { type: String, required: true },
    syllabus: [
      {
        title: { type: String, required: true },
        duration: { type: String, required: true },
        topics: [{ type: String }],
      },
    ],
    prerequisites: [{ type: String }],
    keyOutcomes: [{ type: String }],
    enrolledStudents: { type: Number, default: 120 },
    creatorId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
