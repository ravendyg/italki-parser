import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ISearchResultDto,
  ISearchDto,
} from 'types/dto';
import { DbService } from 'src/services/db.service';

@Controller('lessons')
export class LessonsController {
  constructor(
    private dbService: DbService,
  ) {}

  @Get()
  async get(@Query() query: ISearchDto): Promise<ISearchResultDto> {
    const result = await this.dbService.getTeacherLessons(query);
    return result;
  }
}
