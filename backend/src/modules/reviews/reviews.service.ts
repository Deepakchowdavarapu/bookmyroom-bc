import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../../entities/user.entity';
import { BookingStatus } from '../../enums/booking-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const { bookingId, ...reviewData } = createReviewDto;

    const existingBooking = await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.booking', 'booking')
      .where('booking.id = :bookingId', { bookingId })
      .getOne();

    if (existingBooking) {
      throw new UnauthorizedException('Review already exists for this booking');
    }

    const booking = await this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.booking', 'booking')
      .where('booking.id = :bookingId', { bookingId })
      .andWhere('booking.customer = :userId', { userId: user.id })
      .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getOne();

    if (!booking) {
      throw new UnauthorizedException('Cannot review: booking not found or not completed');
    }

    const review = this.reviewsRepository.create({
      ...reviewData,
      customer: user,
      booking: { id: bookingId },
    });

    return this.reviewsRepository.save(review);
  }

  async getListingReviews(listingId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { listing: { id: listingId } },
      relations: ['customer'],
    });
  }

  async getUserReviews(user: User): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { customer: { id: user.id } },
      relations: ['listing'],
    });
  }
}