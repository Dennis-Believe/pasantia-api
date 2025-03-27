import { Hono } from 'hono';
import { OTBService } from './otbService';
import { OTBController } from './otbController';

export const otbRoutes = new Hono();

const otbService = new OTBService();
const otbController = new OTBController(otbService);

otbRoutes.post('/', otbController.validateOtb);
