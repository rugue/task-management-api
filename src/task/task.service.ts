import { Injectable } from '@nestjs/common';
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
    const { createdBy, ...taskData } = createTaskDto;
    const user = await this.userRepository.findOne({
      where: { id: createdBy },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const task = this.taskRepository.create({ ...taskData, createdBy: user });
    return this.taskRepository.save(task);
  }
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }
  async getTaskById(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id } });
  }
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { createdBy, ...taskData } = updateTaskDto;
    let user;
    if (createdBy) {
      user = await this.userRepository.findOne({ where: { id: createdBy } });
      if (!user) {
        throw new Error('User not found');
      }
    }
    await this.taskRepository.update(id, { ...taskData, createdBy: user });
    return this.taskRepository.findOne({ where: { id } });
  }
  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
