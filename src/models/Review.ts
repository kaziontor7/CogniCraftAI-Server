import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  courseId: mongoose.Types.ObjectId | string;
  userName: string;
  userAvatar: string;
  userRole: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, required: true },
    userRole: { type: String, default: 'Software Engineer' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
