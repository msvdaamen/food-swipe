import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QueryLogService } from '@modules/tools/query-logs/query-log.service';
import { TabsComponent } from '../../../common/components/tab/tabs.component';
import { TabComponent } from '@common/components/tab/tab.component';
import { TabHeaderComponent } from '../../../common/components/tab/tab-header.component';
import { TabContentComponent } from '../../../common/components/tab/tab-content.component';

@Component({
  imports: [
    DecimalPipe,
    TabsComponent,
    TabComponent,
    TabHeaderComponent,
    TabContentComponent,
  ],
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
