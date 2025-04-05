class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
        this.currentMusic = null;
        this.isMuted = false;
        this.volume = 0.1;
        this.effectVolume = 0.1;
        this.settings = null;
        this.activePools = [];
        this.activeEffects = new Set();
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {

            var that = this;

            const path = this.downloadQueue[i];
            console.log(path);
            var ext = path.substring(path.length - 3);
            
            switch (ext) {
                case 'png':
                    const img = new Image();
                    //const path = this.downloadQueue[i];
                    //console.log(path);

                    img.addEventListener("load", () => {
                    console.log("Loaded " + img.src);
                    this.successCount++;
                    if (this.isDone()) callback();
                    });

                    img.addEventListener("error", () => {
                        console.log("Error loading " + img.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'wav':
                    var aud = new Audio();
                    aud.addEventListener("loadeddata", function () {
                        console.log("Loaded " + this.src);
                        that.successCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("error", function () {
                        console.log("Error loading " + this.src);
                        that.errorCount++;
                        if (that.isDone()) callback();
                    });

                    aud.loop = true;

                    aud.addEventListener("ended", function () {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.cache[path] = aud;
                    break;
            }
            
        }
    };

    getAsset(path) {
        return this.cache[path];
    };

    playAsset(path) {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        this.currentMusic = this.cache[path];
        if (this.currentMusic && !this.isMuted) {
            this.currentMusic.volume = this.volume;
            this.currentMusic.play();
        }
    };

    playSoundEffect(path) {
        // const sound = this.cache[path];
        // if (sound && !this.isMuted) {
        //     if (sound.paused || sound.ended) {
        //         sound.volume = this.effectVolume;
        //         sound.currentTime = 0;
        //         sound.play();
        //     }
        // }
        if (this.isMuted) return;
        
        const originalSound = this.cache[path];
        if (!originalSound) return;
        
        // Create a temporary audio element
        const tempSound = new Audio(originalSound.src);
        tempSound.volume = this.effectVolume;
        tempSound.loop = true;
        
        // Track this sound effect
        this.activeEffects.add(tempSound);
        
        // Remove from tracking when it ends
        tempSound.addEventListener('ended', () => {
            this.activeEffects.delete(tempSound);
            tempSound.src = '';
        }, { once: true });
        
        tempSound.play().catch(e => console.error("Error playing sound:", e));
        
        return tempSound; // Return the sound so we can control it later
    }
    

    muteAudio() {
        if (this.currentMusic) {
            this.isMuted = !this.isMuted;
            if (this.isMuted) {
                this.currentMusic.pause();
            } else {
                this.currentMusic.play();
            }
        }

       
        document.getElementById("muteMusic").textContent = this.isMuted ? "Unmute" : "Mute";
    };

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    };

    adjustVolume(volume) {
        this.volume = volume;
        if (this.currentMusic) {
            this.currentMusic.volume = volume;
        }
    };

    adjustEffect(volume) {
        this.effectVolume = volume;
    };

    pauseBackgroundMusic() {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path) {
        var aud = this.cache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    };

    // This allows multiple audio clips to play at the same time.
    createAudioPool(path, size) {
        const audioPool = [];
        const originalAudio = this.cache[path];
        
        if (!originalAudio) {
            console.error(`Audio file not found: ${path}`);
            return audioPool;
        }
        
        // Create clones of the original audio
        for (let i = 0; i < size; i++) {
            const audio = new Audio(originalAudio.src);
            audio.volume = this.effectVolume;
            audioPool.push(audio);
        }

        this.activePools.push(audioPool);
        
        return audioPool;
    }

    // Add this method to play from a pool
    playFromPool(audioPool, effectName) {

        if (this.settings && !this.settings.isSoundEffectEnabled(effectName)) {
            return;
        }

        if (this.isMuted || audioPool.length === 0) return;
        
        // Find an audio element that's not playing
        for (let audio of audioPool) {
            if (audio.paused || audio.ended) {
                audio.volume = this.effectVolume;
                audio.currentTime = 0;
                audio.loop = false;
                audio.play().catch(e => console.error("Error playing audio:", e));
                return;
            }
        }
        
        // If all are playing, use the first one (oldest)
        const audio = audioPool[0];
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Error playing audio:", e));
    }

    setSettings(settings) {
        this.settings = settings;
    }

    stopAllSoundEffects() {
        // Go through all pools and stop any playing sounds
        this.activePools.forEach(pool => {
            pool.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        });

        this.activeEffects.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            this.activeEffects.delete(audio);
        });
    }

}