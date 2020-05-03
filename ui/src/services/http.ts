import axios from 'axios';
import {
  ISearchDto,
  ISearchResultDto,
} from '../types/dto';
import { config } from '../config';


class Http {
  private _base: string;

  constructor() {
    this._base = config.baseUrl;
  }

  async getLessons(params: ISearchDto): Promise<ISearchResultDto | null> {
    const url = this._base + '/lessons';
    try {
      const res = await axios.get(url, { params });
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export const http = new Http();
