import { Injectable } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from './entities/billing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private billingRepository: Repository<Billing>,
  ) {}

  async create(createBillingDto: CreateBillingDto) {
    const newBilling = this.billingRepository.create(createBillingDto);
    return await this.billingRepository.save(newBilling);
  }

  findAll() {
    return this.billingRepository.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.billingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findOneByUserId(userId: string) {
    return this.billingRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async update(id: string, updateBillingDto: UpdateBillingDto) {
    await this.billingRepository.update(id, updateBillingDto);
    return this.findOne(id);
  }
}
