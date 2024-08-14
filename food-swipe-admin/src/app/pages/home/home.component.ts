import { Component } from '@angular/core';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, FaIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  protected readonly faChevronRight = faChevronRight;
}
