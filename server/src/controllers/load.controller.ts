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

@Controller('load')
export class LoadController {
  constructor(
    private dbService: DbService,
  ) {}

  @Get()
  async get(@Query() query: ISearchDto): Promise<ISearchResultDto> {
    const result = await this.dbService.getTeachersLoad(query);
    return result;
  }
}
