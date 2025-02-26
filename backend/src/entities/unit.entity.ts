import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Listing } from './listing.entity';
import { Booking } from './booking.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column()
  isAvailable: boolean;

  @ManyToOne(() => Listing, listing => listing.units)
  listing: Listing;

  @OneToMany(() => Booking, booking => booking.unit)
  bookings: Booking[];
}