import { Subscription } from 'rxjs';
import { GameLoopService } from 'src/app/ui/services/game-loop.service';

export class KeyMap {
    private pressedKeys = new Set<string>();
    private firstEvent = new Set<string>();
    private listeners = new Set<{ event: string, listener: (e: Event) => void }>();
    private subscription: Subscription;
    private isListening = true;

    constructor(private loop: GameLoopService = null) {
        if (loop) {
            this.subscription = loop.tick$.subscribe((ellapsedTimeMs) => this.tick(ellapsedTimeMs));
        } else {
            this.waitForInput();
        }
    }

    private waitForInput() {
        if (!this.isListening) { return; }
        this.tick(0);
        requestAnimationFrame(() => this.waitForInput());
    }

    public addListeners() {
        const keydown = (e) => this.keydown(e);
        const keyup = (e) => this.keyup(e);

        document.addEventListener('keydown', keydown, { passive: true });
        document.addEventListener('keyup', keyup, { passive: true });

        this.listeners.add({ event: 'keydown', listener: keydown });
        this.listeners.add({ event: 'keyup', listener: keyup });
    }

    private keydown(e: KeyboardEvent) {
        const key = this.map(e.key);
        if (typeof this[key] === typeof Function) {
            if (!this.pressedKeys.has(key)) {
                this.pressedKeys.add(key);
                this.firstEvent.add(key);
            }
        }
    }

    private keyup(e: KeyboardEvent) {
        const key = this.map(e.key);
        if (this.pressedKeys.has(key)) {
            this.pressedKeys.delete(key);
        }
    }

    public removeListeners() {
        if (this.listeners) {
            for (const listener of this.listeners) {
                document.removeEventListener(listener.event, listener.listener);
            }
            this.listeners.clear();
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    private map(key: string) {
        switch (key) {
            case ' ': return 'space';
            case 'Escape': return 'esc';
            default: return key.toLowerCase();
        }
    }

    private tick(ellapsedTimeMs: number) {
        for (const key of this.pressedKeys.values()) {
            if (!this[key]) {
                console.log('key nicht definiert', key);
            } else {
                const first = this.firstEvent.has(key);
                if (first) {
                    this.firstEvent.delete(key);
                }
                if (this[key](ellapsedTimeMs, first)) {
                    this.pressedKeys.delete(key);
                }
            }
        }
    }
}
