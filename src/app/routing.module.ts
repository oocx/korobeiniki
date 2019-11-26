import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { TwoPlayerGameComponent } from './components/two-player-game/two-player-game.component';
import { MenuComponent } from './components/menu/menu.component';
import { CreditsComponent } from './components/credits/credits.component';
import { HighscoreComponent } from './components/highscore/highscore.component';
import { LoadingCompletedGuard } from './infrastructure/loading-completed.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [ LoadingCompletedGuard ]  },
  { path: 'game', component: GameComponent, canActivate: [ LoadingCompletedGuard ] },
  { path: 'vs', component: TwoPlayerGameComponent, canActivate: [ LoadingCompletedGuard ] },
  { path: 'highscore', component: HighscoreComponent, canActivate: [ LoadingCompletedGuard ]  },
  { path: 'credits', component: CreditsComponent, canActivate: [ LoadingCompletedGuard ]  },
  { path: '',   redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }

