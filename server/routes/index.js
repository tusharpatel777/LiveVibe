import { Router } from 'express';
import roomRoutes from './roomRoutes.js';

const router = Router();
router.use('/rooms', roomRoutes);

export default router;
