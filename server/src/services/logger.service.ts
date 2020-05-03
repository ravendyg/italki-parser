import { Injectable } from '@nestjs/common';


@Injectable()
export class Logger {
  log(...args) {
    console.log(...args);
  }
  error(...args) {
    console.error(...args);
  }
  debug(...args) {
    console.debug(...args);
  }
  info(...args) {
    console.info(...args);
  }
}
