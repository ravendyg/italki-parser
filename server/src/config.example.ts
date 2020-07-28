import { ClientConfig } from 'pg';
import {
  IConfig,
  EDebugLevel,
} from '../types/types';

const PG_CONFIG: ClientConfig = {
  database: '<db_name>',
  host: '<host>',
  password: '<password>',
  port: 5434,
  user: '<user_name>',
};

export const config: IConfig = {
  PG_CONFIG,
  PORT: 3011,
  PARSER_INTERVAL: 1000 * 60,
  DEBUG_LEVEL: EDebugLevel.DEBUG,
};
