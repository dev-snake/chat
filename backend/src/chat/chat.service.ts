import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(content: string, senderId: number) {
    const message = this.messageRepository.create({
      content,
      senderId,
    });
    return await this.messageRepository.save(message);
  }

  async getAllMessages() {
    return await this.messageRepository.find({
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
