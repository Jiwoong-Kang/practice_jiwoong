import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consent } from '@consent/entities/consent.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(Consent)
    private readonly consentRepository: Repository<Consent>,
  ) {}
}
