import { Controller } from '@nestjs/common';
import { ConsentService } from './consent.service';

@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}
}
