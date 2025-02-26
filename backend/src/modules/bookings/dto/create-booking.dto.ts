import { IsNotEmpty, IsUUID, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  listingId: string;

  @IsUUID()
  @IsNotEmpty()
  unitId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}