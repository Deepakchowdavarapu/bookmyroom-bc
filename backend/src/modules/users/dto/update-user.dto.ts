import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}