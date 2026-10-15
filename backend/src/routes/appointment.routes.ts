import { Router } from 'express';
import { getAvailability, createAppointment } from '../controllers/appointment.controller';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', createAppointment);

export default router;