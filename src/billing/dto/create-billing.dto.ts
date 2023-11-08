import {
  IsDate, IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { ValidPlans, ValidPrices } from '../interfaces';

export class CreateBillingDto {
  @IsEnum(ValidPlans)
  plan: string;

  @IsEnum(ValidPrices)
  price: number;

  @IsNumber()
  @IsOptional()
  imageQuantity?: number;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  billingHistory?: string;
}
