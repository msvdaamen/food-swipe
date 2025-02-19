import {
  Component,
  computed,
  contentChildren,
  effect,
  signal,
} from '@angular/core';
import { TabComponent } from './tab.component';
import { NgTemplateOutlet } from '@angular/common';
import { TabHeaderComponent } from './tab-header.component';
import { TabContentComponent } from './tab-content.component';

@Component({
  selector: 'app-tabs',
  template: `
    <ng-content></ng-content>
    <div class="flex flex-row">
      @for (header of tabHeaders(); let index = $index; track index) {
        <div
          class="cursor-pointer border-b-2 border-transparent px-4 pb-2 transition-colors duration-300"
          [class.border-primary-500]="activeTab() === index"
          [class.border-transparent]="activeTab() !== index"
          [class.text-gray-500]="activeTab() !== index"
          (click)="setActiveTab(index)"
        >
          <ng-container [ngTemplateOutlet]="header.template()"></ng-container>
        </div>
      }
    </div>
    <div>
      @if (activeTabContent(); as activeTabContent) {
        <ng-container
          [ngTemplateOutlet]="activeTabContent.template()"
        ></ng-container>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
})
export class TabsComponent {
  tabs = contentChildren(TabComponent);

  tabHeaders = computed(() => {
    const tabs = this.tabs();
    if (!tabs) return [];
    const headers: TabHeaderComponent[] = [];
    for (const tab of tabs) {
      const header = tab.header();
      if (header) {
        headers.push(header);
      }
    }
    return headers;
  });
  tabContents = computed(() => {
    const tabs = this.tabs();
    if (!tabs) return [];
    const contents: TabContentComponent[] = [];
    for (const tab of tabs) {
      const content = tab.content();
      if (content) {
        contents.push(content);
      }
    }
    return contents;
  });
  activeTabContent = computed(() => {
    const contents = this.tabContents();
    const activeTab = this.activeTab();
    return contents[activeTab];
  });
  activeTab = signal(0);

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }

  constructor() {
    effect(() => {
      console.log(this.tabHeaders());
    });
  }
}
