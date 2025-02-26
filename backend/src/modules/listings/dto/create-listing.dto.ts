import { IsString, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { ListingType } from '../../../enums/listing-type.enum';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ListingType)
  type: ListingType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}