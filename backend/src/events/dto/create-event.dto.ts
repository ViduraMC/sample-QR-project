import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsPositive,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;

  @IsDateString({}, { message: 'Invalid date format. Use ISO 8601 format' })
  @IsNotEmpty({ message: 'Date and time is required' })
  dateTime: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MaxLength(500, { message: 'Location cannot exceed 500 characters' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'Organizer name is required' })
  @MaxLength(255, { message: 'Organizer name cannot exceed 255 characters' })
  organizer: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Ticket price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Ticket price must be a positive number' })
  ticketPrice: number;
}
