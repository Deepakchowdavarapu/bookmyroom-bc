import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ListingType } from '../enums/listing-type.enum';
import { Unit } from './unit.entity';
import { Review } from './review.entity';
import { Booking } from './booking.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ListingType
  })
  type: ListingType;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column('text', { array: true })
  images: string[];

  @ManyToOne(() => User, user => user.listings)
  vendor: User;

  @OneToMany(() => Unit, unit => unit.listing)
  units: Unit[];

  @OneToMany(() => Review, review => review.listing)
  reviews: Review[];

  @OneToMany(() => Booking, booking => booking.listing)
  bookings: Booking[];
}