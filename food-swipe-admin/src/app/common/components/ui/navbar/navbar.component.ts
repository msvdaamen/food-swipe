import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {MenuTriggerDirective} from "@common/components/ui/menu/menu-trigger.directive";
import {MenuDirective} from "@common/components/ui/menu/menu.directive";
import {MenuItemDirective} from "@common/components/ui/menu/menu-item.directive";
import {AuthRepository} from "@modules/auth";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenuTriggerDirective, MenuDirective, MenuItemDirective, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly authRepository = inject(AuthRepository);

  public profileImage$ = this.authRepository.profileImage$;

  logout() {
    this.authRepository.logout();
  }
}
