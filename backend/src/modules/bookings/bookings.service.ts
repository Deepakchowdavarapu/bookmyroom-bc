import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role.enum';
import { BookingStatus } from '../../enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      customer: user,
      status: BookingStatus.PENDING,
    });
    return this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['customer', 'listing', 'unit'],
    });
  }

  async getBookingsByUser(user: User): Promise<Booking[]> {
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.listing', 'listing')
      .leftJoinAndSelect('booking.unit', 'unit');

    if (user.role === UserRole.CUSTOMER) {
      query.where('booking.customer = :userId', { userId: user.id });
    } else if (user.role === UserRole.VENDOR) {
      query.where('listing.vendor = :userId', { userId: user.id });
    }

    return query.getMany();
  }

  async findOne(id: string, user: User): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['customer', 'listing', 'unit', 'listing.vendor'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      user.role !== UserRole.ADMIN &&
      booking.customer.id !== user.id &&
      booking.listing.vendor.id !== user.id
    ) {
      throw new UnauthorizedException('You can only view your own bookings');
    }

    return booking;
  }

  async updateStatus(id: string, status: BookingStatus, user: User): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (
      user.role !== UserRole.ADMIN &&
      booking.listing.vendor.id !== user.id
    ) {
      throw new UnauthorizedException('You can only update status of bookings for your listings');
    }

    booking.status = status;
    return this.bookingsRepository.save(booking);
  }
}