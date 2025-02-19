import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-tab-header',
  template: `<ng-template><ng-content></ng-content></ng-template>`,
})
export class TabHeaderComponent {
  template = viewChild.required(TemplateRef);
}
