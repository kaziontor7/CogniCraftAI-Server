import { Router } from 'express';
import { login, register, getProfile, enrollCourse, cancelCourseEnrollment } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', getProfile);
router.post('/enroll', enrollCourse);
router.post('/cancel-enrollment', cancelCourseEnrollment);

export default router;
