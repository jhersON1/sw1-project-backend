import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from './entities/billing.entity';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  imports: [TypeOrmModule.forFeature([Billing])],
})
export class BillingModule {}
