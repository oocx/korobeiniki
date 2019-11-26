import { Injectable, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LogService } from '../infrastructure/log.service';

/**
 * Loads music and sound effects and provides an api
 * to playback sound and music.
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public finishedLoadingSounds$ = new ReplaySubject<boolean>(1);

  public finishedLoadingSounds = false;

  private loadedSounds: Map<soundName, AudioBuffer> = new Map();

  private loadedMusic: Map<musicName, AudioBuffer> = new Map();

  private currentMusic: AudioBufferSourceNode = null;

  private sheduledMusic: musicName = null;

  private audioContext: AudioContext = new AudioContext();

  constructor(private httpClient: HttpClient, private log: LogService, private appRef: ApplicationRef) {
    this.loadAllSoundsAndMusic();
  }

  /**
   * Preload all sound and music files.
   * The game waits until all sound effects are loaded.
   * It does not wait for the music.
   */
  public async loadAllSoundsAndMusic() {
    for (const name of Object.getOwnPropertyNames(sounds)) {
        const buffer = await this.load(sounds[name]);
        this.loadedSounds.set(name as soundName, buffer);
    }

    this.finishedLoadingSounds$.next(true);
    this.finishedLoadingSounds = true;
    this.appRef.tick();

    for (const name of Object.getOwnPropertyNames(music)) {
      const buffer = await this.load(music[name]);
      this.loadedMusic.set(name as musicName, buffer);
      if (name === this.sheduledMusic) {
        // we were already supposed to play that song, but it was not loaded yet. play it now
        this.playMusic(name);
      }
    }

    this.appRef.tick();
  }

  public playMusic(song: musicName) {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic.disconnect();
    }
    this.currentMusic = this.getMusicBufferSource(song);
    if (this.currentMusic) {
      this.currentMusic.loop = true;
      this.currentMusic.start();
    } else {
      // play it as soon as it is loaded
      this.sheduledMusic = song;
    }
  }

  public stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.loop = true;
      this.currentMusic.stop();
    }
  }

  public setSpeed(speed: number) {
    if (this.currentMusic) {
      this.currentMusic.playbackRate.value = speed;
    }
  }

  private load(file: string) {
    return this.httpClient.get(file, { responseType: 'arraybuffer' })
    .pipe(
      map(async response => {
        try {
          const buffer = await this.audioContext.decodeAudioData(response);
          return buffer;
        } catch (ex) {
          console.error('could not load audio file', file, ex);
          return null;
        }
      })
    ).toPromise();
  }

  public playSound(sound: soundName, player: number = -1) {
    const buffer = this.getSoundBufferSource(sound, player);
    if (buffer) {
      buffer.start();
    }
  }

  private getMusicBufferSource(song: musicName) {
    const buffer = this.loadedMusic.get(song);
    if (!buffer) { return null; }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    return source;
  }

  private getSoundBufferSource(sound: soundName, player: number) {
    const buffer = this.loadedSounds.get(sound);
    if (!buffer) { return null; }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    // For a two player game, uses stereo panning to play
    // the sounds for each players game more to the left / right,
    // so that they are played back on the same side as the
    // field of the player on the screen.

    if (player === 0) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = -0.5;

      source.connect(panner);
      panner.connect(this.audioContext.destination);
    } else if (player === 1) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = 0.5;

      source.connect(panner);
      panner.connect(this.audioContext.destination);
    } else {
      source.connect(this.audioContext.destination);
    }
    return source;
  }
}

const music = {
  /* music */
  tetrisc64kraku: '/assets/tetris_c64_kraku.mp3',
  tetris: '/assets/Tetris-SongA.mp3',
  twister: '/assets/twister.mp3',
  cementcity: '/assets/cementcity.mp3',
  djtc: '/assets/djtc-tetris.mp3',
  KorobeinikiFPM: '/assets/Korobeiniki__Free_Production_Music.mp3',
};

const sounds = {
  /* sound effects */
  hit: '/assets/hit.mp3',
  coin1: '/assets/coin1.mp3',
  coin8: '/assets/coin8.mp3',
  coin10: '/assets/coin10.mp3',
  pop3: '/assets/pop3.mp3',
  retro_misc_04: '/assets/retro_misc_04.mp3',
  synth_misc_12: '/assets/synth_misc_12.mp3',
};

type soundName = keyof typeof sounds;
type musicName = keyof typeof music;
