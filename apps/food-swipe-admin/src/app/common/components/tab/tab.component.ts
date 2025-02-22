import { Component, contentChild } from '@angular/core';
import { TabHeaderComponent } from './tab-header.component';
import { TabContentComponent } from './tab-content.component';

@Component({
  selector: 'app-tab',
  template: `<ng-content></ng-content>`,
})
export class TabComponent {
  header = contentChild(TabHeaderComponent);
  content = contentChild(TabContentComponent);
}
