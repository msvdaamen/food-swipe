import { Injectable } from '@angular/core';
import { Service } from 'src/app/common/service';
import { QueryLog } from './types/query-log.type';

@Injectable({
  providedIn: 'root',
})
export class QueryLogService extends Service {
  getQueryLogs() {
    return this.http.get<QueryLog[]>(`${this.api}/tools/query-logs`);
  }
}
