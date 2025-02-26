import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Listing } from './listing.entity';
import { Unit } from './unit.entity';
import { BookingStatus } from '../enums/booking-status.enum';
import { Review } from './review.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.bookings)
  customer: User;

  @ManyToOne(() => Listing, listing => listing.bookings)
  listing: Listing;

  @ManyToOne(() => Unit, unit => unit.bookings)
  unit: Unit;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('decimal')
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @OneToOne(() => Review, review => review.booking)
  review: Review;

  @CreateDateColumn()
  createdAt: Date;
}