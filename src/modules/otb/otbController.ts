import { Context } from 'hono';
import { OTBService } from './otbService';
import { otbSchema } from './dto/otb.dto';
import { HTTPException } from 'hono/http-exception';

export class OTBController {
  private otbService: OTBService;

  constructor(otbService: OTBService) {
    this.otbService = otbService;
  }

  validateOtb = async(c:Context)=>{
    try {
      const body = await c.req.json();
      const result = otbSchema.safeParse(body);
      if (!result.success) {
        return c.json({ message: 'Datos inválidos', errors: result.error.formErrors.fieldErrors }, 400);
      }
      const { email, token } = result.data;
      const response = await this.otbService.getOTBByEmail(email,token);
      return c.json(response);
    } catch (error: any) {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: error.message });
    }
  }
}
