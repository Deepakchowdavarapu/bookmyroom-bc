import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role.enum';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async create(createListingDto: CreateListingDto, user: User): Promise<Listing> {
    const listing = this.listingsRepository.create({
      ...createListingDto,
      vendor: user,
    });
    return this.listingsRepository.save(listing);
  }

  async findAll(): Promise<Listing[]> {
    return this.listingsRepository.find({
      relations: ['vendor', 'units', 'reviews'],
    });
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['vendor', 'units', 'reviews'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async update(id: string, updateListingDto: CreateListingDto, user: User): Promise<Listing> {
    const listing = await this.findOne(id);
    
    if (listing.vendor.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can only update your own listings');
    }

    Object.assign(listing, updateListingDto);
    return this.listingsRepository.save(listing);
  }

  async remove(id: string, user: User): Promise<void> {
    const listing = await this.findOne(id);
    
    if (listing.vendor.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can only delete your own listings');
    }

    await this.listingsRepository.remove(listing);
  }
}