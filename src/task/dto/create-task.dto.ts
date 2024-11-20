import { IsString, IsDate, IsOptional, IsUUID } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  dueDate: Date;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: User;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
