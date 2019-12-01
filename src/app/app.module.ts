import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './ui/components/app/app.component';
import { BlockComponent } from './ui/components/block/block.component';
import { FieldComponent } from './ui/components/field/field.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './ui/components/login/login.component';
import { RoutingModule } from './routing.module';
import { GameComponent } from './ui/components/game/game.component';
import { HighscoreComponent } from './ui/components/highscore/highscore.component';
import { MenuComponent } from './ui/components/menu/menu.component';
import { CreditsComponent } from './ui/components/credits/credits.component';
import { TwoPlayerGameComponent } from './ui/components/two-player-game/two-player-game.component';
import { EnterPlayerNameComponent } from './ui/components/enter-player-name/enter-player-name.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    FieldComponent,
    LoginComponent,
    GameComponent,
    HighscoreComponent,
    MenuComponent,
    CreditsComponent,
    TwoPlayerGameComponent,
    EnterPlayerNameComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
