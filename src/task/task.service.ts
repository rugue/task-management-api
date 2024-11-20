import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }
  async getTaskById(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id } });
  }
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOne({ where: { id } });
  }
  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
