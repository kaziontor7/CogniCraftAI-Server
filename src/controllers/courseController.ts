import { Request, Response } from 'express';
import Course from '../models/Course';
import Review from '../models/Review';

// Get Courses with Filtering, Searching, Sorting, and Pagination
export const getCourses = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      minRating,
      sort = 'newest',
      page = 1,
      limit = 8,
    } = req.query;

    const query: any = {};

    // Search filter
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOptions: any = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else if (sort === 'popular') sortOptions.enrolledStudents = -1;
    else sortOptions.createdAt = -1; // Default newest

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Course.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Course by ID or Slug
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let course = await Course.findById(id).catch(() => null);

    if (!course) {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Get reviews for this course
    const reviews = await Review.find({ courseId: course._id }).sort({ createdAt: -1 });

    // Get related courses (same category, excluding current course)
    const relatedCourses = await Course.find({
      category: course.category,
      _id: { $ne: course._id },
    }).limit(4);

    res.json({
      success: true,
      data: course,
      reviews,
      relatedCourses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add New Course (/items/add)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      level,
      price,
      duration,
      shortDescription,
      fullDescription,
      imageUrl,
      tags,
      syllabus,
      prerequisites,
      keyOutcomes,
      instructorName,
      instructorRole,
      instructorAvatar,
      creatorId,
    } = req.body;

    if (!title || !category || !level || price === undefined || !shortDescription || !fullDescription) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newCourse = new Course({
      title,
      slug,
      category,
      level,
      price: Number(price),
      duration: duration || '6 Weeks',
      shortDescription,
      fullDescription,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      tags: tags || [category, level],
      syllabus: syllabus || [
        {
          title: 'Module 1: Foundations & Architecture',
          duration: 'Week 1-2',
          topics: ['Introduction & Core Concepts', 'Setting up the Development Environment'],
        },
      ],
      prerequisites: prerequisites || ['Basic JavaScript/TypeScript knowledge'],
      keyOutcomes: keyOutcomes || ['Build production ready software', 'Architect scalable AI systems'],
      instructorName: instructorName || 'Demo Instructor',
      instructorRole: instructorRole || 'Senior Engineer',
      instructorAvatar: instructorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      creatorId: creatorId || 'demo-instructor-id',
      rating: 4.9,
      reviewsCount: 1,
      enrolledStudents: 1,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Course (/items/manage)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course deleted successfully', data: { id } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course updated successfully', data: updatedCourse });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Dashboard Stats for Landing Page & Recharts
export const getPlatformStats = async (_req: Request, res: Response) => {
  try {
    const totalCourses = await Course.countDocuments();
    const categoriesCount = await Course.distinct('category');
    
    res.json({
      success: true,
      data: {
        totalEnrolled: 18450,
        activeStudents: 4320,
        completionRate: '94.2%',
        totalCourses,
        categoriesCount: categoriesCount.length,
        aiReviewsGenerated: 142800,
        monthlyMetrics: [
          { month: 'Jan', enrollments: 1200, completions: 980, aiPrompts: 12400 },
          { month: 'Feb', enrollments: 1900, completions: 1450, aiPrompts: 21000 },
          { month: 'Mar', enrollments: 2400, completions: 2100, aiPrompts: 34000 },
          { month: 'Apr', enrollments: 3100, completions: 2850, aiPrompts: 48000 },
          { month: 'May', enrollments: 4200, completions: 3900, aiPrompts: 65000 },
          { month: 'Jun', enrollments: 5650, completions: 5200, aiPrompts: 92000 },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
