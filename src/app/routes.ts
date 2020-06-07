import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { UserGuard } from './core/user.guard';
import { LIST_ROUTES } from './list/cookbook-list.module';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectUnauthorizedToPublic = () =>
  redirectUnauthorizedTo(['list', 'public']);

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToPublic },
    redirectTo: 'list/personal',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'list',
        children: [...LIST_ROUTES],
      },
      {
        path: 'recipe',
        loadChildren: () =>
          import('./recipe/recipe.module').then((m) => m.RecipeModule),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./edit-recipe/edit-recipe.module').then(
            (m) => m.EditRecipeModule
          ),
      },
      {
        path: 'account',
        canActivate: [AuthGuard, UserGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'choose-username',
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        loadChildren: () =>
          import('./choose-username/choose-username.module').then(
            (m) => m.ChooseUsernameModule
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./register/register.module').then((m) => m.RegisterModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./about/about.module').then((m) => m.AboutModule),
      },
    ],
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToPublic },
    redirectTo: 'list/personal',
  },
];
