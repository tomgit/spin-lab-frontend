// src/engine/SoundManager.ts
export class SoundManager {
    private static instance: SoundManager;
    private sounds: Record<string, HTMLAudioElement[]> = {};
    private volume: number = 1;

    private constructor() {}

    static getInstance() {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    load(name: string, mp3Path: string, oggPath: string, instances: number = 5) {
        this.sounds[name] = [];

        for (let i = 0; i < instances; i++) {
            const audio = new Audio();
            audio.volume = this.volume;

            if (audio.canPlayType("audio/ogg")) {
                audio.src = oggPath;
            } else {
                audio.src = mp3Path;
            }

            this.sounds[name].push(audio);
        }
    }

    play(name: string) {
        const list = this.sounds[name];
        if (!list) return;

        const audio = list.find(a => a.paused);
        const a = audio ?? list[0];

        a.currentTime = 0;
        a.play();
    }

    stopAll() {
        for (const key in this.sounds) {
            for (const audio of this.sounds[key]) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }

    unlockAudio() {
        for (const key in this.sounds) {
            for (const audio of this.sounds[key]) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            }
        }
    }


    setVolume(v: number) {
        this.volume = v;
        for (const key in this.sounds) {
            for (const audio of this.sounds[key]) {
                audio.volume = v;
            }
        }
    }
}
