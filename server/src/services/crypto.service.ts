import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Logger } from './logger.service';



@Injectable()
export class Crypto {
  constructor(
    private logger: Logger
  ) {}

  getSha256(arg: any) {
    this.logger.debug('crypto.getSha256', arg);

    let str: string;
    if (typeof arg === 'string') {
      str = arg;
    } else {
      str = JSON.stringify(arg);
    }
    return createHash('sha256').update(str).digest('latin1');
  }
}
