import { OtbController } from '@/controllers/OtbController';
import { Hono } from 'hono';

export const otbRoutes = new Hono();


otbRoutes.post('/', async (c) => {
  return OtbController.getOTB(c); 
});
