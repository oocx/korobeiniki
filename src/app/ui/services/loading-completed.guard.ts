import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AudioService } from 'src/app/audio/audio.service';

@Injectable({
    providedIn: 'root'
})
export class LoadingCompletedGuard implements CanActivate {

    constructor(private audio: AudioService, private router: Router) {}

    canActivate() {
        if (!this.audio.finishedLoadingSounds) {
            this.router.navigate(['/login']);
        }
        return this.audio.finishedLoadingSounds;
    }
}
