import { Injectable } from '@nestjs/common';
import { EDebugLevel } from 'types/types';
import { config } from '../config';


@Injectable()
export class Logger {
  log(...args) {
    console.log(...args);
  }
  error(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.ERROR) {
      console.error(...args);
    }
  }
  debug(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.DEBUG) {
      console.debug(...args);
    }
  }
  info(...args) {
    if (config.DEBUG_LEVEL <= EDebugLevel.INFO) {
      console.info(...args);
    }
  }
}
