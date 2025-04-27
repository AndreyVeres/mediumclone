import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tagsEntityes = await this.tagService.findAll();

    return {
      tags: tagsEntityes.map((entity) => entity.name),
    };
  }
}
