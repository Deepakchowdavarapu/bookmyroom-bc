import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { BookingStatus } from '../../enums/booking-status.enum';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  create(@Body() createBookingDto: CreateBookingDto, @GetUser() user: User) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  getMyBookings(@GetUser() user: User) {
    return this.bookingsService.getBookingsByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Put(':id/status')
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @GetUser() user: User,
  ) {
    return this.bookingsService.updateStatus(id, status, user);
  }
}