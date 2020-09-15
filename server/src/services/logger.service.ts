import { Injectable } from '@nestjs/common';
import { EDebugLevel } from 'types/types';
import { config } from '../config';


@Injectable()
export class Logger {
  private getDate() {
    return new Date().toISOString().slice(0, 19);
  }
  log(...args) {
    console.log(this.getDate(), ...args);
  }
  error(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.ERROR) {
      console.error(this.getDate(),...args);
    }
  }
  debug(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.DEBUG) {
      console.debug(this.getDate(),...args);
    }
  }
  info(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.INFO) {
      console.info(this.getDate(),...args);
    }
  }
}
