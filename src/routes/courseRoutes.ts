import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
  getPlatformStats,
} from '../controllers/courseController';

const router = Router();

router.get('/', getCourses);
router.get('/stats', getPlatformStats);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
