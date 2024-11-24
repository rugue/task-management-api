import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { createdBy, ...taskData } = createTaskDto;
      const user = await this.userRepository.findOne({
        where: { id: createdBy },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const task = this.taskRepository.create({ ...taskData, createdBy: user });
      return this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }
  async getAllTasks(
    page: number,
    limit: number,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    try {
      const [data, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total, page, limit };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }
  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve task');
    }
  }
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const { createdBy, ...taskData } = updateTaskDto;
      let user;
      if (createdBy) {
        user = await this.userRepository.findOne({ where: { id: createdBy } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }
      await this.taskRepository.update(id, { ...taskData, createdBy: user });
      const updatedTask = await this.taskRepository.findOne({ where: { id } });
      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }
      return updatedTask;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task');
    }
  }
  async deleteTask(id: string): Promise<void> {
    try {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Task not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
