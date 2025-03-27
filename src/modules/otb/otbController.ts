import { Context } from 'hono';
import { OTBService } from './otbService';
import { otbSchema } from './dto/otb.dto';

export class OTBController {
  private otbService: OTBService;

  constructor(otbService: OTBService) {
    this.otbService = otbService;
  }

  getOTB = async (c: Context) => {
    try {
      const body = await c.req.json();
      const result = otbSchema.safeParse(body);
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400);
      }
      const { email } = result.data;
      const response = await this.otbService.getOTBByEmail(email);
      return c.json(response);
    } catch (error: any) {
      console.error(error);
      return c.json({ error: error.message }, 401);
    }
  }
}
