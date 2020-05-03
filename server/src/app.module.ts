import { Module } from '@nestjs/common';
import { LoadController } from './controllers/load.controller';
import { DbService } from './services/db.service';
import { NewDate } from './services/newDate.service';
import { Parser } from './services/parser.service';
import { Logger } from './services/logger.service';
import { Crypto } from './services/crypto.service';
import { Http } from './services/http.service';

@Module({
  controllers: [LoadController],
  providers: [
    Crypto,
    DbService,
    Http,
    Logger,
    NewDate,
    Parser,
  ],
})
export class AppModule {}
