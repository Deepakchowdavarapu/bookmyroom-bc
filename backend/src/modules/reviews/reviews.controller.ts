import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get('listing/:listingId')
  getListingReviews(@Param('listingId') listingId: string) {
    return this.reviewsService.getListingReviews(listingId);
  }

  @Get('my-reviews')
  getMyReviews(@GetUser() user: User) {
    return this.reviewsService.getUserReviews(user);
  }
}