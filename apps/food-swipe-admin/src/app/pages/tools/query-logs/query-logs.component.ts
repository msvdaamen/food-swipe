import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QueryLogService } from '@modules/tools/query-logs/query-log.service';
import { TabsComponent } from '../../../common/components/tab/tabs.component';
import { TabComponent } from '@common/components/tab/tab.component';
import { TabHeaderComponent } from '../../../common/components/tab/tab-header.component';
import { TabContentComponent } from '../../../common/components/tab/tab-content.component';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
@Component({
  imports: [
    DecimalPipe,
    TabsComponent,
    TabComponent,
    TabHeaderComponent,
    TabContentComponent,
    ButtonComponent,
    FaIconComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './query-logs.component.html',
  styleUrl: './query-logs.component.scss',
})
export default class QueryLogsComponent {
  queryLogService = inject(QueryLogService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  totalTimeLogs = rxResource({
    loader: () => this.queryLogService.getQueryLogs('totalExecTime'),
  });
  callsLogs = rxResource({
    loader: () => this.queryLogService.getQueryLogs('calls'),
  });
  maxTimeLogs = rxResource({
    loader: () => this.queryLogService.getQueryLogs('maxExecTime'),
  });

  isLoading = computed(() => {
    return (
      this.totalTimeLogs.isLoading() ||
      this.callsLogs.isLoading() ||
      this.maxTimeLogs.isLoading()
    );
  });

  activeTab = signal(0);

  faRefresh = faRefresh;

  constructor() {
    this.activatedRoute.queryParamMap.pipe(first()).subscribe((params) => {
      this.activeTab.set(parseInt(params.get('tab') || '0'));
    });
    effect(() => {
      this.router.navigate([], {
        queryParams: {
          tab: this.activeTab(),
        },
      });
    });
  }

  refresh() {
    this.totalTimeLogs.reload();
    this.callsLogs.reload();
    this.maxTimeLogs.reload();
  }

  getIttr(columns: number) {
    return new Array(columns);
  }
}
