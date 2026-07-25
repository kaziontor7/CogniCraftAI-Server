import { Router } from 'express';
import {
  chatAssistant,
  streamChatAssistant,
  analyzeCareerPath,
  generateCourseContent,
} from '../controllers/aiController';

const router = Router();

router.post('/chat', chatAssistant);
router.post('/stream-chat', streamChatAssistant);
router.post('/career-analysis', analyzeCareerPath);
router.post('/generate-content', generateCourseContent);

export default router;
