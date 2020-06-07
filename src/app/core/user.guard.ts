import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

// Must be used only after AuthGuard

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getCurrentUsername().pipe(
      map((username): boolean | UrlTree => {
        if (!username) {
          const tree = this.router.parseUrl(
            `/choose-username?p=${encodeURIComponent(state.url)}`
          );
          return tree;
        }
        return true;
      })
    );
  }
}
