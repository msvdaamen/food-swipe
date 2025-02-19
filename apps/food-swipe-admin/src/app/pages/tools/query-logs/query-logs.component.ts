import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QueryLogService } from '@modules/tools/query-logs/query-log.service';

@Component({
  imports: [DecimalPipe],
  templateUrl: './query-logs.component.html',
  styleUrl: './query-logs.component.scss',
})
export default class QueryLogsComponent {
  queryLogService = inject(QueryLogService);

  logs = rxResource({
    loader: () => this.queryLogService.getQueryLogs(),
  });

  logs2 = rxResource({
    loader: () => this.queryLogService.getQueryLogs(),
  });
}
