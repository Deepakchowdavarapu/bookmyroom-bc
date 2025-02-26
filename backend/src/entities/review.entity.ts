import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Listing } from './listing.entity';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, user => user.reviews)
  customer: User;

  @ManyToOne(() => Listing, listing => listing.reviews)
  listing: Listing;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;

  @CreateDateColumn()
  createdAt: Date;
}