import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  appPages = [
    {
      title: 'Liste publique',
      url: '/list',
      icon: 'home',
    },
    {
      title: 'Nouvelle recette',
      url: '/create',
      icon: 'add',
    },
  ];

  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(private readonly authService: UserService) {}

  async logout() {
    await this.authService.logout();
  }
}
