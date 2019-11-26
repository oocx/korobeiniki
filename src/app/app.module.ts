import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { BlockComponent } from './block/block.component';
import { FieldComponent } from './components/field/field.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RoutingModule } from './routing.module';
import { GameComponent } from './components/game/game.component';
import { HighscoreComponent } from './components/highscore/highscore.component';
import { MenuComponent } from './components/menu/menu.component';
import { CreditsComponent } from './components/credits/credits.component';
import { TwoPlayerGameComponent } from './components/two-player-game/two-player-game.component';
import { EnterPlayerNameComponent } from './components/enter-player-name/enter-player-name.component';
import { NavigationMusicService } from './audio/navigation-music.service';

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
