import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidPlans, ValidPrices } from '../interfaces';

export class CreateBillingDto {
  @IsEnum(ValidPlans)
  plan: string;

  @IsEnum(ValidPrices)
  price: number;

  @IsNumber()
  @IsOptional()
  imageQuantity?: number;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  billingHistory?: string;
}
