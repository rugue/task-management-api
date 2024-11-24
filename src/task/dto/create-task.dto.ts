import {
  IsString,
  IsDate,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @MinDate(new Date(), {
    message: 'Due date must be a future date',
  })
  @Type(() => Date)
  dueDate: Date;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
