import { Hono } from 'hono';
import { authRoutes } from './AuthRoutes'; 
import { otbRoutes } from './OtbRoutes';

const apiRoutes = new Hono();

apiRoutes.route('/auth', authRoutes);
apiRoutes.route('/otb',otbRoutes)

export default apiRoutes;
