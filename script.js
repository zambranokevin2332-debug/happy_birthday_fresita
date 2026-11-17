
        class MagicSoundEngine {
            constructor() {
                this.ctx = null;
                this.enabled = true;
                this.bgMusic = document.getElementById('bg-music');
                if (this.bgMusic) {
                    this.bgMusic.volume = 0.45;
                }
            }

            init() {
                if (!this.ctx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) this.ctx = new AudioCtx();
                }
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
            }

            toggle() {
                this.enabled = !this.enabled;
                if (!this.enabled) {
                    this.stopAmbientMelody();
                } else {
                    this.init();
                    this.startAmbientMelody();
                }
                return this.enabled;
            }

            playChime(freqs = [523.25, 659.25, 783.99, 1046.50], duration = 0.6, stagger = 0.07, volume = 0.12) {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + i * stagger);

                    gain.gain.setValueAtTime(0.0001, now + i * stagger);
                    gain.gain.exponentialRampToValueAtTime(volume, now + i * stagger + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * stagger + duration);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + i * stagger);
                    osc.stop(now + i * stagger + duration + 0.05);
                });
            }

            playRibbonPull() {
                this.playChime([440, 554.37, 659.25, 880], 0.3, 0.04, 0.08);
            }

            playBoxOpenMagic() {
                this.playChime([523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98], 1.1, 0.08, 0.14);
            }

            playButterflySparkle() {
                this.playChime([880, 1174.66, 1318.51, 1760], 0.45, 0.05, 0.08);
            }

            playPerfumeSpray() {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const bufferSize = this.ctx.sampleRate * 0.35;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
                }
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(3200, now);

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                noise.start(now);

                this.playChime([783.99, 1046.50, 1318.51], 0.6, 0.06, 0.09);
            }

            startAmbientMelody() {
                if (!this.enabled) return;
                if (this.bgMusic) {
                    this.bgMusic.play().catch(e => console.warn("Audio bloqueado hasta interactuar:", e));
                }
            }

            stopAmbientMelody() {
                if (this.bgMusic) {
                    this.bgMusic.pause();
                }
            }
        }

        const soundEngine = new MagicSoundEngine();

        const StrawberryArt = {
            drawStrawberryIcon(ctx, x, y, size, rotation = 0) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);
                const s = size;

                const grad = ctx.createRadialGradient(-s * 0.2, -s * 0.2, s * 0.1, 0, 0, s);
                grad.addColorStop(0, '#ff7597');
                grad.addColorStop(0.6, '#ff2e63');
                grad.addColorStop(1, '#c9184a');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(0, s * 0.95);
                ctx.bezierCurveTo(-s * 0.95, s * 0.45, -s * 0.95, -s * 0.55, 0, -s * 0.45);
                ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.95, s * 0.45, 0, s * 0.95);
                ctx.fill();
                ctx.lineWidth = Math.max(1.5, s * 0.07);
                ctx.strokeStyle = '#9e1338';
                ctx.stroke();

                ctx.fillStyle = '#ffe5ec';
                const seeds = [
                    [-0.32, -0.1], [0.32, -0.1], [0, 0.05],
                    [-0.25, 0.3], [0.25, 0.3], [0, 0.55]
                ];
                seeds.forEach(([sx, sy]) => {
                    ctx.beginPath();
                    ctx.ellipse(sx * s, sy * s, s * 0.055, s * 0.09, 0, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.fillStyle = '#52b788';
                ctx.strokeStyle = '#2d6a4f';
                ctx.beginPath();
                ctx.moveTo(0, -s * 0.38);
                ctx.quadraticCurveTo(-s * 0.55, -s * 0.75, -s * 0.7, -s * 0.28);
                ctx.quadraticCurveTo(-s * 0.3, -s * 0.25, 0, -s * 0.38);
                ctx.quadraticCurveTo(s * 0.3, -s * 0.25, s * 0.7, -s * 0.28);
                ctx.quadraticCurveTo(s * 0.55, -s * 0.75, 0, -s * 0.38);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, -s * 0.4);
                ctx.lineTo(0, -s * 0.72);
                ctx.lineWidth = Math.max(2, s * 0.1);
                ctx.strokeStyle = '#40916c';
                ctx.stroke();

                ctx.restore();
            },

            drawRibbonBow(ctx, x, y, size) {
                ctx.save();
                ctx.translate(x, y);
                const s = size;

                ctx.fillStyle = '#ff4d79';
                ctx.strokeStyle = '#a4133c';
                ctx.lineWidth = Math.max(2, s * 0.06);

                ctx.beginPath();
                ctx.moveTo(-s * 0.15, s * 0.1);
                ctx.lineTo(-s * 0.55, s * 0.85);
                ctx.lineTo(-s * 0.25, s * 0.75);
                ctx.lineTo(-s * 0.05, s * 0.2);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(s * 0.15, s * 0.1);
                ctx.lineTo(s * 0.55, s * 0.85);
                ctx.lineTo(s * 0.25, s * 0.75);
                ctx.lineTo(s * 0.05, s * 0.2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ff7597';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-s * 0.95, -s * 0.65, -s * 1.05, s * 0.55, 0, s * 0.12);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(s * 0.95, -s * 0.65, s * 1.05, s * 0.55, 0, s * 0.12);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ff4d79';
                ctx.beginPath();
                ctx.roundRect(-s * 0.18, -s * 0.16, s * 0.36, s * 0.34, s * 0.1);
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            },

            drawCupcake(ctx, x, y, size) {
                ctx.save();
                ctx.translate(x, y);
                const s = size;

                ctx.fillStyle = '#95d5b2';
                ctx.strokeStyle = '#40916c';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-s * 0.55, 0);
                ctx.lineTo(-s * 0.4, s * 0.7);
                ctx.lineTo(s * 0.4, s * 0.7);
                ctx.lineTo(s * 0.55, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ff8fa3';
                ctx.strokeStyle = '#c9184a';
                ctx.beginPath();
                ctx.arc(-s * 0.32, -s * 0.05, s * 0.28, 0, Math.PI * 2);
                ctx.arc(s * 0.32, -s * 0.05, s * 0.28, 0, Math.PI * 2);
                ctx.arc(0, -s * 0.25, s * 0.36, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                this.drawStrawberryIcon(ctx, 0, -s * 0.62, s * 0.26);

                ctx.restore();
            },

            drawFresitaCharacter(ctx, cx, cy, scale = 1, options = {}) {
                const { crown = false, prop = 'heart', wink = false } = options;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.scale(scale, scale);

                const hairGrad = ctx.createLinearGradient(0, -90, 0, 80);
                hairGrad.addColorStop(0, '#e01e5a');
                hairGrad.addColorStop(0.5, '#c9184a');
                hairGrad.addColorStop(1, '#9e1338');

                ctx.fillStyle = hairGrad;
                ctx.strokeStyle = '#6e0d27';
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.arc(-52, 10, 34, 0, Math.PI * 2);
                ctx.arc(52, 10, 34, 0, Math.PI * 2);
                ctx.arc(-62, 42, 30, 0, Math.PI * 2);
                ctx.arc(62, 42, 30, 0, Math.PI * 2);
                ctx.arc(0, 15, 62, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.save();
                ctx.translate(-18, 92);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-10, 0, 20, 42);
                ctx.fillStyle = '#74c69d';
                for (let y = 4; y < 40; y += 10) {
                    ctx.fillRect(-10, y, 20, 5);
                }
                ctx.strokeStyle = '#40916c';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(-10, 0, 20, 42);
                ctx.fillStyle = '#ff2e63';
                ctx.strokeStyle = '#800f2f';
                ctx.beginPath();
                ctx.ellipse(-2, 45, 16, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.translate(18, 92);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-10, 0, 20, 42);
                ctx.fillStyle = '#74c69d';
                for (let y = 4; y < 40; y += 10) {
                    ctx.fillRect(-10, y, 20, 5);
                }
                ctx.strokeStyle = '#40916c';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(-10, 0, 20, 42);
                ctx.fillStyle = '#ff2e63';
                ctx.strokeStyle = '#800f2f';
                ctx.beginPath();
                ctx.ellipse(2, 45, 16, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();

                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#c9184a';
                ctx.lineWidth = 2.8;
                ctx.beginPath();
                ctx.moveTo(-26, 38);
                ctx.lineTo(26, 38);
                ctx.lineTo(32, 62);
                ctx.lineTo(-32, 62);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(-32, 46, 12, 0, Math.PI * 2);
                ctx.arc(32, 46, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                this.drawStrawberryIcon(ctx, 0, 50, 7);

                ctx.fillStyle = '#ff8fa3';
                ctx.beginPath();
                ctx.moveTo(-32, 60);
                ctx.lineTo(32, 60);
                ctx.lineTo(48, 98);
                ctx.quadraticCurveTo(0, 106, -48, 98);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ff2e63';
                [[-20, 72], [0, 70], [20, 72], [-28, 88], [-10, 86], [10, 86], [28, 88]].forEach(([dx, dy]) => {
                    ctx.beginPath();
                    ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.strokeStyle = '#c97b63';
                ctx.fillStyle = '#ffd6ba';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.ellipse(-34, 66, 7, 17, 0.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(34, 66, 7, 17, -0.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ffe0cc';
                ctx.strokeStyle = '#c97b63';
                ctx.lineWidth = 2.8;
                ctx.beginPath();
                ctx.ellipse(0, -2, 46, 42, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 77, 121, 0.32)';
                ctx.beginPath();
                ctx.ellipse(-26, 10, 10, 6, 0, 0, Math.PI * 2);
                ctx.ellipse(26, 10, 10, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#d47a63';
                [[-14, 7], [-9, 10], [-18, 11], [14, 7], [9, 10], [18, 11]].forEach(([fx, fy]) => {
                    ctx.beginPath();
                    ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.fillStyle = '#2d6a4f';
                ctx.beginPath();
                ctx.ellipse(-18, -2, 7.5, 9.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#52b788';
                ctx.beginPath();
                ctx.arc(-18, 0, 4.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(-20, -5, 2.8, 0, Math.PI * 2);
                ctx.fill();

                if (wink) {
                    ctx.strokeStyle = '#5c2c24';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(18, 0, 8, Math.PI * 1.15, Math.PI * 1.85);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = '#2d6a4f';
                    ctx.beginPath();
                    ctx.ellipse(18, -2, 7.5, 9.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#52b788';
                    ctx.beginPath();
                    ctx.arc(18, 0, 4.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(16, -5, 2.8, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.strokeStyle = '#b81d43';
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.arc(0, 13, 10, 0.15 * Math.PI, 0.85 * Math.PI);
                ctx.stroke();

                ctx.fillStyle = '#d91c54';
                ctx.strokeStyle = '#6e0d27';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(-42, -16);
                ctx.quadraticCurveTo(-15, -6, 0, -24);
                ctx.quadraticCurveTo(18, -6, 42, -16);
                ctx.quadraticCurveTo(25, -45, 0, -45);
                ctx.quadraticCurveTo(-25, -45, -42, -16);
                ctx.fill();
                ctx.stroke();

                ctx.save();
                ctx.translate(0, -46);
                ctx.rotate(-0.08);

                ctx.fillStyle = '#74c69d';
                ctx.strokeStyle = '#2d6a4f';
                ctx.lineWidth = 2.8;
                ctx.beginPath();
                ctx.ellipse(-14, 14, 38, 12, -0.22, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                const hatGrad = ctx.createRadialGradient(-15, -25, 10, 0, -15, 75);
                hatGrad.addColorStop(0, '#ffb3c6');
                hatGrad.addColorStop(0.6, '#ff7597');
                hatGrad.addColorStop(1, '#e01e5a');

                ctx.fillStyle = hatGrad;
                ctx.strokeStyle = '#9e1338';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(0, -14, 64, 42, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.ellipse(0, 10, 54, 9, 0, 0, Math.PI);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#b81d43';
                [
                    [-36, -22], [-14, -32], [12, -30], [36, -20],
                    [-24, -6], [0, -12], [24, -6]
                ].forEach(([sx, sy]) => {
                    ctx.beginPath();
                    ctx.ellipse(sx, sy, 3.2, 5.2, 0.15, 0, Math.PI * 2);
                    ctx.fill();
                });

                if (!crown) {
                    ctx.fillStyle = '#52b788';
                    ctx.strokeStyle = '#2d6a4f';
                    ctx.beginPath();
                    ctx.ellipse(8, -55, 14, 7, -0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.save();
                    ctx.translate(0, -56);
                    ctx.fillStyle = '#ffd166';
                    ctx.strokeStyle = '#b5830d';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(-24, 6);
                    ctx.lineTo(-28, -18);
                    ctx.lineTo(-10, -4);
                    ctx.lineTo(0, -24);
                    ctx.lineTo(10, -4);
                    ctx.lineTo(28, -18);
                    ctx.lineTo(24, 6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#ff2e63';
                    ctx.beginPath();
                    ctx.arc(0, -6, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.restore();

                if (prop === 'heart') {
                    ctx.save();
                    ctx.translate(0, 74);
                    ctx.fillStyle = '#ff2e63';
                    ctx.strokeStyle = '#800f2f';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(0, 14);
                    ctx.bezierCurveTo(-22, 0, -22, -18, 0, -8);
                    ctx.bezierCurveTo(22, -18, 22, 0, 0, 14);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                } else if (prop === 'flowers') {
                    this.drawStrawberryIcon(ctx, -46, 56, 12, -0.3);
                    this.drawStrawberryIcon(ctx, -36, 46, 11, 0.1);
                    this.drawCupcake(ctx, -42, 72, 12);
                } else if (prop === 'cupcake') {
                    this.drawCupcake(ctx, 0, 74, 18);
                } else if (prop === 'gift') {
                    ctx.save();
                    ctx.translate(0, 74);
                    ctx.fillStyle = '#ff8fa3';
                    ctx.strokeStyle = '#a4133c';
                    ctx.lineWidth = 2;
                    ctx.fillRect(-15, -12, 30, 24);
                    ctx.strokeRect(-15, -12, 30, 24);
                    ctx.fillStyle = '#ffd166';
                    ctx.fillRect(-3, -12, 6, 24);
                    ctx.fillRect(-15, -3, 30, 6);
                    ctx.restore();
                }

                ctx.restore();
            }
        };

        function createBoxTopTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 2048;
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);

            const bg = ctx.createLinearGradient(0, 0, 1024, 1024);
            bg.addColorStop(0, '#fffcfd');
            bg.addColorStop(1, '#fff0f4');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, 1024, 1024);

            ctx.strokeStyle = '#ff8fa3';
            ctx.lineWidth = 14;
            ctx.strokeRect(36, 36, 952, 952);

            StrawberryArt.drawStrawberryIcon(ctx, 130, 140, 42, -0.2);
            StrawberryArt.drawCupcake(ctx, 880, 150, 44);
            StrawberryArt.drawCupcake(ctx, 150, 860, 44);
            StrawberryArt.drawStrawberryIcon(ctx, 880, 870, 42, 0.25);

            StrawberryArt.drawFresitaCharacter(ctx, 650, 640, 1.6, { crown: true, prop: 'heart' });

            ctx.save();
            ctx.textAlign = 'center';
            ctx.font = 'bold 130px "Great Vibes", cursive';
            ctx.lineWidth = 16;
            ctx.strokeStyle = '#ffffff';
            ctx.strokeText('Para ti, en tu día', 512, 200);
            ctx.fillStyle = '#e01e5a';
            ctx.fillText('Para ti, en tu día', 512, 200);
            ctx.restore();

            StrawberryArt.drawCupcake(ctx, 860, 720, 38);
            StrawberryArt.drawStrawberryIcon(ctx, 420, 740, 32, -0.2);

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = 8;
            return tex;
        }

        function createBoxLidInsideTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 2048;
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);

            ctx.fillStyle = '#ffb3c6';
            ctx.fillRect(0, 0, 1024, 1024);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            for (let x = 40; x < 1000; x += 65) {
                for (let y = 40; y < 1000; y += 65) {
                    if (x < 110 || x > 910 || y < 110 || y > 910) {
                        ctx.beginPath();
                        ctx.arc(x, y, 10, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            ctx.fillStyle = '#fff9fb';
            ctx.beginPath();
            ctx.roundRect(105, 105, 814, 814, 42);
            ctx.fill();
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ff7597';
            ctx.stroke();

            StrawberryArt.drawFresitaCharacter(ctx, 330, 530, 1.7, { crown: false, prop: 'flowers', wink: true });

            ctx.save();
            ctx.textAlign = 'center';
            ctx.fillStyle = '#6e2b3d';
            ctx.fillStyle = '#6e2b3d';
            ctx.font = 'bold 52px "Playfair Display", serif';
            ctx.fillText('Porque te', 700, 345);

            ctx.fillStyle = '#d62851';
            ctx.font = 'bold 76px "Playfair Display", serif';
            ctx.fillText('mereces', 700, 430);

            ctx.fillStyle = '#6e2b3d';
            ctx.font = 'bold 52px "Playfair Display", serif';
            ctx.fillText('todo lo bonito', 700, 510);
            ctx.fillText('de este', 700, 578);

            ctx.fillStyle = '#d62851';
            ctx.font = 'bold 84px "Playfair Display", serif';
            ctx.fillText('mundo', 700, 670);
            ctx.restore();

            StrawberryArt.drawRibbonBow(ctx, 700, 230, 52);

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = 8;
            return tex;
        }

        function createBoxFrontTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#fff9fb';
            ctx.fillRect(0, 0, 1024, 512);

            ctx.strokeStyle = '#ffc2d1';
            ctx.lineWidth = 10;
            ctx.strokeRect(16, 16, 992, 480);

            StrawberryArt.drawRibbonBow(ctx, 512, 250, 62);
            StrawberryArt.drawFresitaCharacter(ctx, 815, 260, 1.25, { prop: 'heart' });
            StrawberryArt.drawStrawberryIcon(ctx, 140, 260, 36, -0.2);

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = 8;
            return tex;
        }

        function createBoxSideTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#fff9fb';
            ctx.fillRect(0, 0, 1024, 512);

            ctx.strokeStyle = '#ffc2d1';
            ctx.lineWidth = 10;
            ctx.strokeRect(16, 16, 992, 480);

            StrawberryArt.drawFresitaCharacter(ctx, 320, 265, 1.25, { prop: 'cupcake', wink: true });
            StrawberryArt.drawRibbonBow(ctx, 680, 255, 58);
            StrawberryArt.drawStrawberryIcon(ctx, 880, 260, 34, 0.2);

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = 8;
            return tex;
        }

        function generateAlbumCardsData() {
            const configs = [
                { id: 0, title: 'Pasala Genial hoy en tu dia, te deseo lo mejor ✨', bg1: '#ffe5ec', bg2: '#ffb3c6', options: { crown: true, prop: 'heart', wink: false } },
                { id: 1, title: 'Flores Para Ti, te mereces lo mejor🌷', bg1: '#f3e5f5', bg2: '#e1bee7', options: { crown: false, prop: 'flowers', wink: true } },
                { id: 2, title: 'Sigues siendo alguien muy especial 🧁', bg1: '#fff0f3', bg2: '#ffc2d1', options: { crown: false, prop: 'cupcake', wink: true } },
                { id: 3, title: 'Gracias por los buenos momentos, HB mi eterno amor 🌸', bg1: '#fce4ec', bg2: '#f8bbd0', options: { crown: true, prop: 'gift', wink: false } }
            ];

            return configs.map(cfg => {
                const c = document.createElement('canvas');
                c.width = 600;
                c.height = 600;
                const ctx = c.getContext('2d');

                const grad = ctx.createRadialGradient(300, 300, 50, 300, 300, 420);
                grad.addColorStop(0, cfg.bg1);
                grad.addColorStop(1, cfg.bg2);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 600, 600);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                [[100, 110], [500, 120], [110, 490], [490, 480], [300, 80]].forEach(([hx, hy]) => {
                    ctx.beginPath();
                    ctx.arc(hx - 8, hy, 9, 0, Math.PI * 2);
                    ctx.arc(hx + 8, hy, 9, 0, Math.PI * 2);
                    ctx.lineTo(hx, hy + 22);
                    ctx.fill();
                });

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 14;
                ctx.strokeRect(24, 24, 552, 552);

                StrawberryArt.drawFresitaCharacter(ctx, 300, 315, 1.85, cfg.options);

                return { id: cfg.id, title: cfg.title, dataUrl: c.toDataURL('image/png') };
            });
        }

        const albumCardsData = generateAlbumCardsData();

        /* MOTOR 3D PRINCIPAL CON THREE.JS */
        let scene, camera, renderer, controls;
        let raycaster, mouse;
        let boxGroup, lidPivot, bowGroup, fresitaCard3D, palette3D;
        let ribbonZ, ribbonX;
        let bowInteractiveMeshes = [];
        let cardInteractiveMeshes = [];
        let perfumeInteractiveMeshes = [];
        let lipsticks = [];
        let albumEntry = null, albumTimer = null;
        let butterflyGroups = [];
        let balloons = [];
        let confettiParticles = [];
        let ambientFloaters = [];

        let isBoxOpened = false;
        let isDraggingBow = false;
        let dragStartY = 0;
        let ribbonPullDistance = 0;
        const PULL_THRESHOLD = 1.35;

        let lastBannerTime = 0;

        let ribbonDisappearAnim = 0;
        let targetLidAngle = 0;
        let currentLidAngle = 0;
        let cardPopProgress = 0;
        let clock = new THREE.Clock();

        /* ENCUADRE RESPONSIVO: ajusta distancia y centro de la cámara para que
           la caja (y la tapa abierta) siempre quepan, en cualquier pantalla */
        const FRAME_CLOSED = { cy: 1.7, hh: 3.1, hw: 3.0 };
        const FRAME_OPEN   = { cy: 2.4, hh: 3.7, hw: 3.3 };
        let frameT = 0;          // 0 = cerrada, 1 = abierta
        let frameDist = null;

        function computeFrame(t) {
            const cy = FRAME_CLOSED.cy + (FRAME_OPEN.cy - FRAME_CLOSED.cy) * t;
            const hh = FRAME_CLOSED.hh + (FRAME_OPEN.hh - FRAME_CLOSED.hh) * t;
            const hw = FRAME_CLOSED.hw + (FRAME_OPEN.hw - FRAME_CLOSED.hw) * t;
            const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const dV = hh / tanV;
            const dH = hw / (tanV * camera.aspect);
            return { cy, dist: Math.max(dV, dH) + 2.2 };
        }

        function applyFrame() {
            if (!camera || !controls) return;
            const f = computeFrame(frameT);
            const offset = camera.position.clone().sub(controls.target);
            let ratio = 1;
            if (frameDist) ratio = offset.length() / frameDist; // conserva el zoom del usuario
            else offset.set(0, 0.28, 1);
            offset.setLength(ratio * f.dist);
            controls.target.set(0, f.cy, 0);
            camera.position.copy(controls.target).add(offset);
            controls.minDistance = f.dist * 0.8;
            controls.maxDistance = f.dist * 1.4;
            frameDist = f.dist;
        }

        /* LISTÓN 3D: tira que se despega y se enrolla como un listón real */
        let peelRibbons = [];
        let isUnwrapping = false, unwrapP = 0;
        const UNWRAP_SECONDS = 10;

        class PeelRibbon {
            constructor(points, normals, side, width, mat, parent) {
                const pts = [], nrm = [];
                for (let k = 0; k < points.length - 1; k++) {
                    const steps = Math.max(2, Math.round(points[k].distanceTo(points[k + 1]) / 0.07));
                    for (let j = 0; j < steps; j++) {
                        pts.push(points[k].clone().lerp(points[k + 1], j / steps));
                        nrm.push(normals[k]);
                    }
                }
                pts.push(points[points.length - 1].clone()); nrm.push(normals[normals.length - 1]);
                this.pts = pts; this.nrm = nrm; this.N = pts.length; this.side = side; this.w = width;
                this.tan = pts.map((p, i) => pts[Math.min(i + 1, this.N - 1)].clone().sub(pts[Math.max(i - 1, 0)]).normalize());
                this.pos = new Float32Array(this.N * 6);
                const idx = [];
                for (let i = 0; i < this.N - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
                const g = new THREE.BufferGeometry();
                g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
                g.setIndex(idx);
                this.mesh = new THREE.Mesh(g, mat);
                this.mesh.castShadow = true;
                this.mesh.frustumCulled = false;
                parent.add(this.mesh);
                this.update(0);
                g.computeBoundingSphere();
            }
            update(f) {
                const v = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
                for (let i = 0; i < this.N; i++) {
                    const a = Math.max(0, f - i / (this.N - 1));
                    v.copy(this.pts[i]).addScaledVector(this.nrm[i], 0.02);
                    if (a > 0) {
                        const phi = a * 9, R = 0.22 + 0.12 * a;
                        v.addScaledVector(this.nrm[i], R * (1 - Math.cos(phi)) + a * 0.7)
                         .addScaledVector(this.tan[i], R * Math.sin(phi))
                         .addScaledVector(up, a * 0.8);
                    }
                    const t = THREE.MathUtils.clamp((a - 0.7) / 0.4, 0, 1);
                    const w = this.w * 0.5 * (1 - t * t * (3 - 2 * t));
                    const o = i * 6;
                    this.pos[o] = v.x - this.side.x * w; this.pos[o + 1] = v.y - this.side.y * w; this.pos[o + 2] = v.z - this.side.z * w;
                    this.pos[o + 3] = v.x + this.side.x * w; this.pos[o + 4] = v.y + this.side.y * w; this.pos[o + 5] = v.z + this.side.z * w;
                }
                const g = this.mesh.geometry;
                g.attributes.position.needsUpdate = true;
                g.computeVertexNormals();
            }
        }

        function startUnwrap() {
            if (isUnwrapping || isBoxOpened) return;
            isUnwrapping = true;
            unwrapP = 0;
            soundEngine.playRibbonPull();
            document.getElementById('guide-text').textContent = 'Mira cómo se desenvuelve tu sorpresa ✨';
        }

        function initThreeScene() {
            const container = document.getElementById('canvas-container');

            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0xfff2f6, 0.018);

            camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
            camera.position.set(0, 3.2, 12.8); // se reajusta con applyFrame()

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.12;
            container.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.06;
            controls.maxPolarAngle = Math.PI / 2 - 0.02;
            controls.enablePan = false; // evita que la caja se desplace fuera de cuadro
            controls.target.set(0, 1.0, 0);
            applyFrame();               // encuadra la caja según el tamaño de pantalla

            const ambientLight = new THREE.AmbientLight(0xfff5f8, 0.85);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
            mainLight.position.set(5, 11, 7);
            mainLight.castShadow = true;
            mainLight.shadow.mapSize.width = 2048;
            mainLight.shadow.mapSize.height = 2048;
            mainLight.shadow.bias = -0.0005;
            scene.add(mainLight);

            const pinkRimLight = new THREE.PointLight(0xff7597, 0.65, 22);
            pinkRimLight.position.set(-6, 5, -4);
            scene.add(pinkRimLight);

            const warmFillLight = new THREE.PointLight(0xffe5ec, 0.55, 20);
            warmFillLight.position.set(6, 3, 5);
            scene.add(warmFillLight);

            const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
            const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
            const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
            shadowPlane.rotation.x = -Math.PI / 2;
            shadowPlane.position.y = -0.51; // Bajamos el plano de sombra junto con la caja
            shadowPlane.receiveShadow = true;
            scene.add(shadowPlane);

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            buildStrawberryGiftBox();
            buildAmbientSpaceDecorations();
            buildButterflies3D();

            window.addEventListener('resize', onWindowResize);
            renderer.domElement.addEventListener('pointerdown', onPointerDown);
            renderer.domElement.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        }

        function buildStrawberryGiftBox() {
            boxGroup = new THREE.Group();
            boxGroup.position.y = -0.35; // Bajamos un poco la caja entera para centrarla en el canvas
            scene.add(boxGroup);

            const boxW = 4.4;
            const boxH = 2.1;
            const boxD = 3.5;
            const wallT = 0.12;

            const frontTex = createBoxFrontTexture();
            const sideTex = createBoxSideTexture();
            const innerPinkMat = new THREE.MeshStandardMaterial({ color: 0xffe5ec, roughness: 0.6 });
            const frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.45 });
            const sideMat = new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.45 });
            const ribbonMat = new THREE.MeshStandardMaterial({
                color: 0xff3b6f,
                roughness: 0.3,
                metalness: 0.1,
                transparent: true,
                opacity: 1
            });

            const bottomGeo = new THREE.BoxGeometry(boxW, wallT, boxD);
            const bottomMesh = new THREE.Mesh(bottomGeo, innerPinkMat);
            bottomMesh.position.y = wallT / 2;
            bottomMesh.castShadow = true;
            bottomMesh.receiveShadow = true;
            boxGroup.add(bottomMesh);

            const frontGeo = new THREE.BoxGeometry(boxW, boxH, wallT);
            const frontMesh = new THREE.Mesh(frontGeo, [
                innerPinkMat, innerPinkMat, innerPinkMat, innerPinkMat, frontMat, innerPinkMat
            ]);
            frontMesh.position.set(0, boxH / 2, boxD / 2 - wallT / 2);
            frontMesh.castShadow = true;
            frontMesh.receiveShadow = true;
            boxGroup.add(frontMesh);

            const frontRibbonGeo = new THREE.BoxGeometry(0.48, boxH + 0.02, 0.03);
            const frontRibbon = new THREE.Mesh(frontRibbonGeo, ribbonMat);
            frontRibbon.position.set(-1.15, boxH / 2, boxD / 2 + 0.01);
            frontRibbon.visible = false;

            const backMesh = new THREE.Mesh(frontGeo, innerPinkMat);
            backMesh.position.set(0, boxH / 2, -boxD / 2 + wallT / 2);
            backMesh.castShadow = true;
            backMesh.receiveShadow = true;
            boxGroup.add(backMesh);

            const sideGeo = new THREE.BoxGeometry(wallT, boxH, boxD - wallT * 2);
            const leftMesh = new THREE.Mesh(sideGeo, [
                innerPinkMat, sideMat, innerPinkMat, innerPinkMat, innerPinkMat, innerPinkMat
            ]);
            leftMesh.position.set(-boxW / 2 + wallT / 2, boxH / 2, 0);
            leftMesh.castShadow = true;
            boxGroup.add(leftMesh);

            const rightMesh = new THREE.Mesh(sideGeo, [
                sideMat, innerPinkMat, innerPinkMat, innerPinkMat, innerPinkMat, innerPinkMat
            ]);
            rightMesh.position.set(boxW / 2 - wallT / 2, boxH / 2, 0);
            rightMesh.castShadow = true;
            boxGroup.add(rightMesh);

            const puffColors = [0xffccd5, 0xfff0f3, 0xffb3c6, 0xffe5ec];
            const puffGeo = new THREE.SphereGeometry(0.28, 16, 16);
            for (let i = 0; i < 48; i++) {
                const mat = new THREE.MeshStandardMaterial({
                    color: puffColors[i % puffColors.length],
                    roughness: 0.92
                });
                const puff = new THREE.Mesh(puffGeo, mat);
                puff.position.set(
                    (Math.random() - 0.5) * (boxW - 0.7),
                    0.28 + Math.random() * 0.25,
                    (Math.random() - 0.5) * (boxD - 0.7)
                );
                const sc = 0.8 + Math.random() * 0.5;
                puff.scale.set(sc, sc * 0.85, sc);
                boxGroup.add(puff);
            }

            const makeupGroup = new THREE.Group();
            makeupGroup.position.set(0.75, 0.55, 0.15);
            boxGroup.add(makeupGroup);

            const lipstickColors = [0xff7597, 0xf4a261, 0xffb3c6, 0xe01e5a];
            const capMat = new THREE.MeshStandardMaterial({ color: 0xe5b869, metalness: 0.75, roughness: 0.22 });

            for (let i = 0; i < 4; i++) {
                const lipGroup = new THREE.Group();
                lipGroup.position.set(-0.65 + i * 0.42, 0.15, -0.55);
                lipGroup.rotation.x = -Math.PI / 2 + 0.08;

                const tubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.85, 20);
                const tubeMat = new THREE.MeshPhysicalMaterial({
                    color: lipstickColors[i],
                    roughness: 0.15,
                    metalness: 0.1,
                    clearcoat: 1.0
                });
                const tube = new THREE.Mesh(tubeGeo, tubeMat);
                lipGroup.add(tube);

                const capGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.35, 20);
                const cap = new THREE.Mesh(capGeo, capMat);
                cap.position.y = 0.58;
                lipGroup.add(cap);

                makeupGroup.add(lipGroup);
                perfumeInteractiveMeshes.push(tube, cap);
                tube.userData.lip = i; cap.userData.lip = i;
                lipsticks.push({ group: lipGroup, tube, cap, i, state: 'in', t: 0, spin: 0 });
            }

            palette3D = new THREE.Group();
            palette3D.position.set(0.05, 0.12, 0.45);
            makeupGroup.add(palette3D);

            const palBaseGeo = new THREE.BoxGeometry(1.45, 0.12, 1.05);
            const palBaseMat = new THREE.MeshStandardMaterial({ color: 0xffd6e0, roughness: 0.35 });
            const palBase = new THREE.Mesh(palBaseGeo, palBaseMat);
            palette3D.add(palBase);

            const shadowColors = [
                0xffccd5, 0xff8fa3, 0xe5b869, 0xd4a373,
                0xfff0f3, 0xfb6f92, 0xb5838d, 0x9c6644
            ];
            const panGeo = new THREE.BoxGeometry(0.28, 0.04, 0.34);
            shadowColors.forEach((col, idx) => {
                const row = Math.floor(idx / 4);
                const colIdx = idx % 4;
                const panMat = new THREE.MeshStandardMaterial({
                    color: col,
                    roughness: idx % 2 === 0 ? 0.3 : 0.6,
                    metalness: idx === 2 ? 0.5 : 0.05
                });
                const pan = new THREE.Mesh(panGeo, panMat);
                pan.position.set(-0.48 + colIdx * 0.32, 0.07, -0.22 + row * 0.42);
                palette3D.add(pan);
                perfumeInteractiveMeshes.push(pan);
            });

            const buildPerfumeBottle = (px, pz, bottleColor, pIndex) => {
                const pGroup = new THREE.Group();
                pGroup.position.set(px, 0.45, pz);

                const glassGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.58, 16);
                const glassMat = new THREE.MeshPhysicalMaterial({
                    color: bottleColor,
                    transmission: 0.55,
                    opacity: 0.92,
                    transparent: true,
                    roughness: 0.1,
                    ior: 1.5
                });
                const glass = new THREE.Mesh(glassGeo, glassMat);
                pGroup.add(glass);

                const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.14, 16);
                const neck = new THREE.Mesh(neckGeo, capMat);
                neck.position.y = 0.34;
                pGroup.add(neck);

                const topGeo = new THREE.SphereGeometry(0.15, 16, 16);
                const topMat = new THREE.MeshStandardMaterial({ color: 0xff2e63, roughness: 0.2 });
                const top = new THREE.Mesh(topGeo, topMat);
                top.position.y = 0.48;
                pGroup.add(top);

                makeupGroup.add(pGroup);
                const idx = lipsticks.length;
                [glass, neck, top].forEach(m => {
                    m.userData.lip = idx;
                    perfumeInteractiveMeshes.push(m);
                });
                const targetPos = pIndex === 0 ? new THREE.Vector3(-1.85, 0.35, 1.35) : new THREE.Vector3(1.85, 0.35, 1.35);
                const msgText = pIndex === 0 ? '✨ Un aroma especial\npara un día especial ✨' : '🌸 Un detalle sutil\ncon mucho cariño 🌸';
                lipsticks.push({
                    group: pGroup,
                    cap: top,
                    capY: 0.48,
                    meshes: [glass, neck, top],
                    i: idx,
                    state: 'in',
                    t: 0,
                    spin: 0,
                    isPerfume: true,
                    finalScale: 1.25,
                    fixedTarget: targetPos,
                    msg: msgText
                });
            };

            buildPerfumeBottle(-1.45, 0.72, 0xff8fa3, 0);
            buildPerfumeBottle(-1.05, 0.85, 0xffccd5, 1);

            fresitaCard3D = new THREE.Group();
            fresitaCard3D.position.set(-0.95, 0.75, -0.15);
            fresitaCard3D.rotation.set(-0.35, 0.15, 0.05);
            boxGroup.add(fresitaCard3D);

            const coverCanvas = createAlbumCoverCanvas();
            const cardTex = new THREE.CanvasTexture(coverCanvas);
            if (document.fonts && document.fonts.load) {
                document.fonts.load('100px "Great Vibes"').then(() => { createAlbumCoverCanvas(coverCanvas); cardTex.needsUpdate = true; });
            }
            cardTex.anisotropy = 4;

            const cardGeo = new THREE.BoxGeometry(1.55, 1.75, 0.06);
            const cardFrontMat = new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.35 });
            const cardEdgeMat = new THREE.MeshStandardMaterial({ color: 0xffb3c6 });
            const cardMesh = new THREE.Mesh(cardGeo, [
                cardEdgeMat, cardEdgeMat, cardEdgeMat, cardEdgeMat, cardFrontMat, cardFrontMat
            ]);
            cardMesh.castShadow = true;
            fresitaCard3D.add(cardMesh);
            cardInteractiveMeshes.push(cardMesh);
            albumEntry = { group: fresitaCard3D, cap: new THREE.Object3D(), meshes: [], i: 99, state: 'in', t: 0, spin: 0,
                isAlbum: true, finalScale: 1.0, fixedTarget: new THREE.Vector3(-1.9, 0.55, 2.0),
                msg: '📸 El album\nde fresita..' };
            lipsticks.push(albumEntry);
            buildKittyDoll();

            lidPivot = new THREE.Group();
            lidPivot.position.set(0, boxH, -boxD / 2);
            boxGroup.add(lidPivot);

            const lidGroup = new THREE.Group();
            lidGroup.position.set(0, 0, boxD / 2);
            lidPivot.add(lidGroup);

            const lidW = boxW + 0.18;
            const lidD = boxD + 0.18;
            const lidH = 0.48;

            const topTex = createBoxTopTexture();
            const insideLidTex = createBoxLidInsideTexture();

            const lidTopMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.4 });
            const lidInsideMat = new THREE.MeshStandardMaterial({ map: insideLidTex, roughness: 0.45 });
            const lidRimMat = new THREE.MeshStandardMaterial({ color: 0xfff5f8, roughness: 0.5 });

            const lidTopGeo = new THREE.BoxGeometry(lidW, 0.1, lidD);
            const lidTopMesh = new THREE.Mesh(lidTopGeo, [
                lidRimMat, lidRimMat, lidTopMat, lidInsideMat, lidRimMat, lidRimMat
            ]);
            lidTopMesh.position.y = lidH - 0.05;
            lidTopMesh.castShadow = true;
            lidTopMesh.receiveShadow = true;
            lidGroup.add(lidTopMesh);

            const skirtFrontGeo = new THREE.BoxGeometry(lidW, lidH, 0.08);
            const skirtFront = new THREE.Mesh(skirtFrontGeo, lidRimMat);
            skirtFront.position.set(0, lidH / 2, lidD / 2 - 0.04);
            skirtFront.castShadow = true;
            lidGroup.add(skirtFront);

            const skirtBack = new THREE.Mesh(skirtFrontGeo, lidRimMat);
            skirtBack.position.set(0, lidH / 2, -lidD / 2 + 0.04);
            lidGroup.add(skirtBack);

            const skirtSideGeo = new THREE.BoxGeometry(0.08, lidH, lidD);
            const skirtLeft = new THREE.Mesh(skirtSideGeo, lidRimMat);
            skirtLeft.position.set(-lidW / 2 + 0.04, lidH / 2, 0);
            lidGroup.add(skirtLeft);

            const skirtRight = new THREE.Mesh(skirtSideGeo, lidRimMat);
            skirtRight.position.set(lidW / 2 - 0.04, lidH / 2, 0);
            lidGroup.add(skirtRight);

            ribbonMat.side = THREE.DoubleSide;
            const V = (x, y, z) => new THREE.Vector3(x, y, z);
            const Y = V(0, 1, 0), top = lidH + 0.03, hD = lidD / 2 + 0.03, hW = lidW / 2 + 0.03;
            const cx = -1.15, cz = -0.55, sideX = V(1, 0, 0), sideZ = V(0, 0, 1);
            const addPeel = (pts, nrm, side) => {
                const r = new PeelRibbon(pts, nrm, side, 0.48, ribbonMat, lidGroup);
                peelRibbons.push(r);
                bowInteractiveMeshes.push(r.mesh);
            };
            // Hacia el frente: tapa, borde y pared frontal de la caja
            addPeel([V(cx, top, cz), V(cx, top, hD), V(cx, 0, hD), V(cx, -0.03, boxD / 2 + 0.03), V(cx, -boxH + 0.05, boxD / 2 + 0.03)],
                    [Y, V(0, 0, 1), V(0, 0, 1), V(0, 0, 1)], sideX);
            // Hacia atrás
            addPeel([V(cx, top, cz), V(cx, top, -hD), V(cx, 0, -hD)], [Y, V(0, 0, -1)], sideX);
            // Hacia los lados
            addPeel([V(cx, top, cz), V(-hW, top, cz), V(-hW, 0, cz)], [Y, V(-1, 0, 0)], sideZ);
            addPeel([V(cx, top, cz), V(hW, top, cz), V(hW, 0, cz)], [Y, V(1, 0, 0)], sideZ);

            bowGroup = new THREE.Group();
            bowGroup.position.set(-1.15, lidH + 0.14, -0.55);
            lidGroup.add(bowGroup);

            const knotGeo = new THREE.SphereGeometry(0.22, 16, 16);
            knotGeo.scale(1.1, 0.85, 1.1);
            const knotMesh = new THREE.Mesh(knotGeo, ribbonMat);
            bowGroup.add(knotMesh);
            bowInteractiveMeshes.push(knotMesh);

            const loopGeo = new THREE.TorusGeometry(0.42, 0.14, 14, 28);
            loopGeo.scale(1.25, 0.65, 0.85);
            const angles = [0.35, Math.PI - 0.35, -0.45, Math.PI + 0.45];
            angles.forEach((ang, idx) => {
                const loop = new THREE.Mesh(loopGeo, ribbonMat);
                loop.rotation.y = ang;
                loop.rotation.z = (idx % 2 === 0 ? 1 : -1) * 0.22;
                loop.position.set(Math.cos(ang) * 0.35, 0.06, -Math.sin(ang) * 0.35);
                loop.castShadow = true;
                bowGroup.add(loop);
                bowInteractiveMeshes.push(loop);
            });
        }

        function buildAmbientSpaceDecorations() {
            const miniColors = [0xff8fa3, 0xffccd5, 0xffd166, 0xa8e6cf];

            for (let i = 0; i < 14; i++) {
                const angle = (i / 14) * Math.PI * 2;
                const radius = 4.8 + Math.random() * 2.2;
                const yPos = -0.2 + Math.random() * 4.2;

                const group = new THREE.Group();
                group.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);

                if (i % 3 === 0) {
                    const s = 0.34 + Math.random() * 0.16;
                    const boxM = new THREE.Mesh(
                        new THREE.BoxGeometry(s, s, s),
                        new THREE.MeshStandardMaterial({ color: miniColors[i % miniColors.length], roughness: 0.4 })
                    );
                    const ribM = new THREE.Mesh(
                        new THREE.BoxGeometry(s + 0.02, s + 0.02, s * 0.22),
                        new THREE.MeshStandardMaterial({ color: 0xff2e63 })
                    );
                    group.add(boxM, ribM);
                } else if (i % 3 === 1) {
                    const body = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12),
                        new THREE.MeshStandardMaterial({ color: 0xff4d79, roughness: 0.25 })
                    );
                    const gold = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.085, 0.085, 0.18, 12),
                        new THREE.MeshStandardMaterial({ color: 0xe5b869, metalness: 0.7, roughness: 0.2 })
                    );
                    gold.position.y = 0.28;
                    group.add(body, gold);
                } else {
                    const berry = new THREE.Mesh(
                        new THREE.ConeGeometry(0.18, 0.34, 14),
                        new THREE.MeshStandardMaterial({ color: 0xff2e63, roughness: 0.3 })
                    );
                    berry.rotation.x = Math.PI;
                    const leaf = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.16, 0.05, 0.06, 8),
                        new THREE.MeshStandardMaterial({ color: 0x52b788 })
                    );
                    leaf.position.y = 0.16;
                    group.add(berry, leaf);
                }

                scene.add(group);
                ambientFloaters.push({
                    mesh: group,
                    baseY: yPos,
                    speed: 0.8 + Math.random() * 0.9,
                    offset: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        }

        function buildButterflies3D() {
            const wingColors = [0xff8fa3, 0xffd166, 0xfff0f3, 0xff4d79, 0xa8e6cf];

            const wingShape = new THREE.Shape();
            wingShape.moveTo(0, 0);
            wingShape.bezierCurveTo(0.25, 0.35, 0.55, 0.25, 0.42, -0.05);
            wingShape.bezierCurveTo(0.5, -0.28, 0.22, -0.35, 0, -0.08);
            const wingGeo = new THREE.ShapeGeometry(wingShape);

            for (let i = 0; i < 7; i++) {
                const bGroup = new THREE.Group();
                const col = wingColors[i % wingColors.length];
                const wingMat = new THREE.MeshStandardMaterial({
                    color: col,
                    side: THREE.DoubleSide,
                    roughness: 0.3,
                    metalness: 0.15
                });

                const leftWing = new THREE.Mesh(wingGeo, wingMat);
                const rightWing = new THREE.Mesh(wingGeo, wingMat);
                rightWing.scale.x = -1;

                const body = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.02, 0.02, 0.26, 8),
                    new THREE.MeshStandardMaterial({ color: 0x6e2b3d })
                );
                body.rotation.x = Math.PI / 2;

                bGroup.add(leftWing, rightWing, body);

                const angle = (i / 7) * Math.PI * 2;
                const radius = 2.6 + (i % 3) * 0.85;
                bGroup.position.set(Math.cos(angle) * radius, 1.5 + (i % 3) * 0.7, Math.sin(angle) * radius);

                scene.add(bGroup);
                butterflyGroups.push({
                    group: bGroup,
                    leftWing,
                    rightWing,
                    angle,
                    radius,
                    baseY: bGroup.position.y,
                    speed: 0.45 + Math.random() * 0.35,
                    flapSpeed: 11 + Math.random() * 4,
                    spinBoost: 0
                });
            }
        }

        function triggerBoxOpenCelebration() {
            const heartShape = new THREE.Shape();
            const x = 0, y = 0;
            heartShape.moveTo(x, y - 0.35);
            heartShape.bezierCurveTo(x - 0.45, y - 0.05, x - 0.45, y + 0.38, x, y + 0.18);
            heartShape.bezierCurveTo(x + 0.45, y + 0.38, x + 0.45, y - 0.05, x, y - 0.35);

            const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
                depth: 0.16,
                bevelEnabled: true,
                bevelSegments: 4,
                steps: 1,
                bevelSize: 0.08,
                bevelThickness: 0.08
            });
            heartGeo.center();

            const sphereGeo = new THREE.SphereGeometry(0.36, 20, 20);
            sphereGeo.scale(0.92, 1.12, 0.92);

            const balloonColors = [0xff2e63, 0xff8fa3, 0xe5b869, 0xfff0f3, 0x74c69d, 0xc9184a];

            for (let i = 0; i < 34; i++) {
                const isHeart = i % 2 === 0;
                const col = balloonColors[i % balloonColors.length];
                const isGold = col === 0xe5b869;

                const mat = new THREE.MeshPhysicalMaterial({
                    color: col,
                    roughness: isGold ? 0.2 : 0.15,
                    metalness: isGold ? 0.75 : 0.1,
                    clearcoat: 0.9
                });

                const bMesh = new THREE.Mesh(isHeart ? heartGeo : sphereGeo, mat);
                bMesh.position.set(
                    (Math.random() - 0.5) * 2.8,
                    0.2 + Math.random() * 0.8,
                    (Math.random() - 0.5) * 2.2
                );
                const scale = 0.75 + Math.random() * 0.55;
                bMesh.scale.setScalar(scale);

                scene.add(bMesh);
                balloons.push({
                    mesh: bMesh,
                    vy: 0.032 + Math.random() * 0.028,
                    vx: (Math.random() - 0.5) * 0.018,
                    vz: (Math.random() - 0.5) * 0.018,
                    wobble: Math.random() * Math.PI * 2
                });
            }

            spawnSparkleBurst(new THREE.Vector3(0, 1.5, 0), 75);
        }

        function spawnSparkleBurst(origin, count = 30) {
            const petalGeo = new THREE.PlaneGeometry(0.16, 0.16);
            const colors = [0xff4d79, 0xffb3c6, 0xffd166, 0xffffff, 0x95d5b2];

            for (let i = 0; i < count; i++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: colors[i % colors.length],
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.95
                });
                const p = new THREE.Mesh(petalGeo, mat);
                p.position.copy(origin);
                p.position.x += (Math.random() - 0.5) * 0.8;
                p.position.z += (Math.random() - 0.5) * 0.8;

                scene.add(p);
                confettiParticles.push({
                    mesh: p,
                    vx: (Math.random() - 0.5) * 0.09,
                    vy: 0.04 + Math.random() * 0.08,
                    vz: (Math.random() - 0.5) * 0.09,
                    rotSpeed: (Math.random() - 0.5) * 0.18,
                    life: 1.0
                });
            }
        }

        function showFloatingBanner(text, wrap) {
            const container = document.getElementById('dynamic-banners');
            container.innerHTML = '';

            const el = document.createElement('div');
            el.className = 'floating-banner font-script text-4xl sm:text-6xl text-[#6e2b3d] text-center px-4 whitespace-nowrap';
            el.textContent = text;
            if (wrap) {
                el.classList.remove('whitespace-nowrap', 'text-4xl', 'sm:text-6xl');
                el.classList.add('text-3xl', 'sm:text-5xl');
                el.style.whiteSpace = 'pre-line';
                el.style.width = '92vw';
                el.style.maxWidth = '640px';
                el.style.lineHeight = '1.25';
            }
            container.appendChild(el);

            setTimeout(() => {
                if (el.parentNode === container) {
                    el.remove();
                }
            }, 3100);
        }

        function onPointerDown(event) {
            const container = document.getElementById('canvas-container');
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            if (!isBoxOpened) {
                if (isUnwrapping) return;
                const hits = raycaster.intersectObjects(bowInteractiveMeshes, true);
                if (hits.length > 0) {
                    startUnwrap();
                } else {
                    const now = Date.now();
                    if (now - lastBannerTime > 2200) {
                        lastBannerTime = now;
                        showFloatingBanner('¡Toca el lazo para abrir tu regalo! 🎀');
                        soundEngine.playChime([350, 300], 0.25, 0.05, 0.08);
                    }
                }
                return;
            }

            const cardHits = raycaster.intersectObjects(cardInteractiveMeshes, true);
            if (cardHits.length > 0) {
                handleAlbumTap();
                return;
            }

            const lipHits = raycaster.intersectObjects(lipsticks.flatMap(l => l.meshes || [l.tube, l.cap]), true);
            if (lipHits.length > 0) {
                handleLipstickTap(lipsticks[lipHits[0].object.userData.lip]);
                return;
            }

            const perfumeHits = raycaster.intersectObjects(perfumeInteractiveMeshes, true);
            if (perfumeHits.length > 0) {
                soundEngine.playPerfumeSpray();
                spawnSparkleBurst(new THREE.Vector3(0.5, 0.8, 0.2), 38);
                const anyIn = lipsticks.some(x => x.state === 'in');
                if (anyIn) {
                    updateBoxGuideHint(true);
                } else {
                    showFloatingBanner('✨ Qué lindo detalle ✨');
                }
                return;
            }

            const butterflyMeshes = butterflyGroups.map(b => b.group);
            const bHits = raycaster.intersectObjects(butterflyMeshes, true);
            if (bHits.length > 0) {
                soundEngine.playButterflySparkle();
                butterflyGroups.forEach(b => {
                    b.spinBoost = 1.0;
                    spawnSparkleBurst(b.group.position, 14);
                });
            }
        }

        /* ===== EXTRACCIÓN 3D DE LOS 4 ARTÍCULOS ===== */
        const _qA = new THREE.Quaternion(), _qB = new THREE.Quaternion(), _qS = new THREE.Quaternion();
        const _Y = new THREE.Vector3(0, 1, 0), _X = new THREE.Vector3(1, 0, 0);

        function createAlbumCoverCanvas(c) {
            c = c || document.createElement('canvas');
            c.width = 600; c.height = 677;
            const x = c.getContext('2d');
            const g = x.createLinearGradient(0, 0, 0, 677);
            g.addColorStop(0, '#fff8fa'); g.addColorStop(1, '#ffd6e0');
            x.fillStyle = g; x.fillRect(0, 0, 600, 677);
            x.strokeStyle = '#ffffff'; x.lineWidth = 16; x.strokeRect(14, 14, 572, 649);
            x.strokeStyle = '#ff4d79'; x.lineWidth = 3; x.setLineDash([10, 9]); x.strokeRect(34, 34, 532, 609); x.setLineDash([]);
            x.fillStyle = 'rgba(255,77,121,0.35)';
            [[70, 80], [530, 80], [70, 600], [530, 600]].forEach(([hx, hy]) => {
                x.beginPath(); x.arc(hx - 8, hy, 9, 0, 7); x.arc(hx + 8, hy, 9, 0, 7); x.lineTo(hx, hy + 22); x.fill();
            });
            x.textAlign = 'center'; x.fillStyle = '#d62851';
            x.font = '108px "Great Vibes", "Alex Brush", cursive';
            x.fillText('Álbum', 300, 135);
            x.font = '72px "Great Vibes", "Alex Brush", cursive';
            x.fillText('de fotos', 300, 205);
            StrawberryArt.drawFresitaCharacter(x, 300, 450, 1.3, { crown: true, prop: 'heart', wink: false });
            return c;
        }

        function buildKittyDoll() { // ahora construye a Fresita (Strawberry Shortcake) en 3D
            const doll = new THREE.Group(), meshes = [];
            const hat = new THREE.Group(); doll.add(hat);
            const M = (geo, color, pos, sc, rot, extra, parent) => {
                const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55 }, extra || {})));
                m.position.set(...pos); if (sc) m.scale.set(...sc); if (rot) m.rotation.set(...rot);
                m.castShadow = true; (parent || doll).add(m); meshes.push(m); return m;
            };
            const S = r => new THREE.SphereGeometry(r, 28, 24);
            const skin = 0xffd2b5, hair = 0xd81b60, pink = 0xff6b9a, deep = 0xe01e5a, green = 0x6fbf44;
            // zapatitos y medias a rayas verdes
            [-1, 1].forEach(sx => {
                M(S(0.14), 0xff2e7a, [sx * 0.19, 0.07, 0.12], [1, 0.55, 1.5]);
                for (let k = 0; k < 5; k++)
                    M(new THREE.CylinderGeometry(0.068, 0.068, 0.1, 16), k % 2 ? 0xffffff : green, [sx * 0.17, 0.14 + k * 0.1, 0.03]);
            });
            // falda con lunares
            M(new THREE.CylinderGeometry(0.2, 0.44, 0.4, 32), 0xffa6c0, [0, 0.74, 0]);
            for (let a = 0; a < 10; a++) {
                const an = a * 0.628, r = a % 2 ? 0.3 : 0.38, y = a % 2 ? 0.8 : 0.66;
                M(S(0.04), pink, [Math.sin(an) * r, y, Math.cos(an) * r], [1, 1, 0.4], [0, an, 0]);
            }
            // blusa blanca con fresita y mangas globo
            M(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 28), 0xffffff, [0, 1.07, 0]);
            M(S(0.055), deep, [0, 1.06, 0.225], [1, 1.1, 0.5]);
            M(S(0.025), green, [0, 1.12, 0.235], [1.6, 0.8, 0.5]);
            [-1, 1].forEach(sx => {
                M(S(0.12), 0xffffff, [sx * 0.28, 1.15, 0]);
                M(new THREE.CylinderGeometry(0.04, 0.04, 0.32, 12), skin, [sx * 0.3, 0.95, 0.05], null, [0, 0, sx * 0.15]);
                M(S(0.05), skin, [sx * 0.27, 0.78, 0.1]);
            });
            // bolsito de fresa
            M(new THREE.BoxGeometry(0.17, 0.14, 0.06), deep, [0.3, 0.62, 0.16]);
            M(S(0.03), green, [0.3, 0.7, 0.16]);
            // cuello y cabeza
            M(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), skin, [0, 1.25, 0]);
            M(S(0.42), skin, [0, 1.56, 0], [1, 0.95, 0.92]);
            // ojos verdes grandes
            [-1, 1].forEach(sx => {
                M(S(0.1), 0xffffff, [sx * 0.17, 1.55, 0.31], [1, 1.2, 0.4]);
                M(S(0.075), 0x3d9a52, [sx * 0.17, 1.55, 0.345], [1, 1.2, 0.35]);
                M(S(0.04), 0x1b2a1b, [sx * 0.17, 1.55, 0.365], [1, 1.2, 0.3]);
                M(S(0.016), 0xffffff, [sx * 0.15, 1.59, 0.375], [1, 1, 0.3]);
                M(S(0.06), 0xffa0a8, [sx * 0.27, 1.44, 0.3], [1, 0.6, 0.3], null, { transparent: true, opacity: 0.6 });
                for (let k = 0; k < 3; k++) M(S(0.01), 0xc98466, [sx * (0.2 + k * 0.035), 1.45 - (k % 2) * 0.03, 0.355]);
            });
            M(S(0.03), 0xf2b896, [0, 1.46, 0.385]);
            M(S(0.04), 0xe0607e, [0, 1.37, 0.37], [1.8, 0.45, 0.4]); // sonrisa
            // cabello magenta ondulado
            M(S(0.5), hair, [0, 1.55, -0.14], [1.1, 1.1, 0.85]);
            [-1, 1].forEach(sx => {
                for (let k = 0; k < 6; k++)
                    M(S(0.15 - k * 0.008), hair, [sx * (0.43 + Math.sin(k * 1.3) * 0.05 + k * 0.012), 1.5 - k * 0.19, -0.04 - k * 0.02]);
                M(S(0.11), hair, [sx * 0.3, 1.72, 0.2], [1, 0.8, 0.7]);
            });
            // gorrito de fresa (se levanta al salir)
            M(S(0.5), pink, [0, 1.98, 0], [1.2, 0.68, 1.12], null, null, hat);
            for (let a = 0; a < 12; a++) {
                const an = a * 0.52, r = 0.5 + (a % 2) * 0.02, y = 2.06 + (a % 3) * 0.07;
                M(S(0.03), deep, [Math.sin(an) * r * 0.9, y - (a % 2) * 0.05, Math.cos(an) * r * 0.85], [0.8, 1.3, 0.8], [0.3, an, 0], null, hat);
            }
            M(new THREE.TorusGeometry(0.47, 0.045, 12, 40), 0xffffff, [0, 1.82, 0], [1.2, 1.12, 1], [Math.PI / 2, 0, 0], null, hat);
            M(new THREE.CylinderGeometry(0.3, 0.3, 0.035, 28), green, [0, 1.86, 0.46], [1.1, 1, 0.7], [0.35, 0, 0], null, hat);

            doll.position.set(1.8, 0.42, -0.3);
            doll.rotation.y = -0.3;
            doll.scale.setScalar(0.6);
            boxGroup.add(doll);

            const idx = lipsticks.length;
            meshes.forEach(m => { m.userData.lip = idx; perfumeInteractiveMeshes.push(m); });
            lipsticks.push({
                group: doll, cap: hat, capY: 0.001, meshes, i: idx, state: 'in', t: 0, spin: 0,
                isDoll: true, finalScale: 1.15, fixedTarget: new THREE.Vector3(0, -0.3, 2.9),
                msg: '¡Feliz cumpleaños!\nQue la pases increíble 🍓'
            });
        }

        const LIP_SIDE_X = [-2.95, 2.95, -2.55, 2.55]; // izquierda, derecha, y luego los más cercanos
        const LIP_SCALE = 1.15;
        const LIP_MESSAGES = [
            'Qué alegres son\nlos recuerdos bonitos 🍓',
            'Un abrazo\ndesde lejos 🤍',
            'Hay detalles que\nsiempre valen la pena 💖',
            'Espero que tengas\nun día maravilloso 🌸'
        ];
        let lipsOut = 0;

        function lipSlot(n) {
            return new THREE.Vector3(LIP_SIDE_X[n], 0.16, 0.9);
        }

        function handleAlbumTap() {
            const a = albumEntry;
            if (a.state === 'in') {
                handleLipstickTap(a);
                let n = 7;
                const guide = document.getElementById('guide-text');
                const oldText = guide.textContent;
                guide.textContent = 'Tus fotitos aparecen en ' + n + '… 📸';
                clearInterval(albumTimer);
                albumTimer = setInterval(() => {
                    n--;
                    spawnSparkleBurst(a.group.position.clone(), 8);
                    if (n > 0) { guide.textContent = 'Tus fotitos aparecen en ' + n + '… 📸'; return; }
                    clearInterval(albumTimer);
                    guide.textContent = oldText;
                    soundEngine.playChime([659.25, 880, 1046.50, 1318.51], 0.7, 0.06, 0.12);
                    openAlbumModal();
                }, 1000);
            } else if (a.state === 'float') {
                soundEngine.playChime([659.25, 880, 1046.50, 1318.51], 0.7, 0.06, 0.12);
                openAlbumModal();
            }
        }

        let reminderInterval = null;

        function getNextPendingHint() {
            // Revisamos qué sigue dentro de la caja ('in')
            const dollItem = lipsticks.find(x => x.isDoll);
            const perfumeItems = lipsticks.filter(x => x.isPerfume);
            const albumItem = albumEntry;
            const lipItems = lipsticks.filter(x => !x.isDoll && !x.isPerfume && !x.isAlbum);

            const dollOut = dollItem && dollItem.state !== 'in';
            const perfumesOut = perfumeItems.filter(p => p.state !== 'in').length;
            const albumOut = albumItem && albumItem.state !== 'in';
            const lipsCountOut = lipItems.filter(lp => lp.state !== 'in').length;

            if (!dollOut) {
                return '¡Aún quedan sorpresas adentro! Toca y saca a la chica Fresita 🍓';
            }
            if (perfumesOut < perfumeItems.length) {
                return perfumesOut === 0
                    ? '¡Faltan cosas en la caja! Ahora saca los perfumes 🌸'
                    : '¡Casi! Saca el otro perfume que queda en la caja ✨';
            }
            if (!albumOut) {
                return '¡No te olvides del álbum! Toca el álbum de fotos para sacarlo 📸';
            }
            if (lipsCountOut < lipItems.length) {
                const faltan = lipItems.length - lipsCountOut;
                return faltan === 1
                    ? '¡Solo falta 1 detallito! Saca el último labial de la caja 💄'
                    : `¡Aún quedan ${faltan} detallitos dentro! Toca los labiales para sacarlos 💄`;
            }
            return '¡Ya sacaste todas tus sorpresas! Toca el álbum o cualquier regalo para interactuar\nPSDT: Espero te guste, muchas Felicidades ✨';
        }

        function updateBoxGuideHint(showBannerAlert = false) {
            const guide = document.getElementById('guide-text');
            if (!guide) return;
            const hint = getNextPendingHint();
            guide.textContent = hint;
            if (showBannerAlert) {
                showFloatingBanner(hint, true);
                soundEngine.playChime([587.33, 783.99], 0.35, 0.06, 0.08);
            }
        }

        function startReminderWatcher() {
            if (reminderInterval) clearInterval(reminderInterval);
            reminderInterval = setInterval(() => {
                if (!isBoxOpened) return;
                const anyIn = lipsticks.some(x => x.state === 'in');
                if (!anyIn) {
                    clearInterval(reminderInterval);
                    updateBoxGuideHint(false);
                    return;
                }
                // Si el usuario lleva rato sin sacar lo que falta, le mostramos el aviso
                updateBoxGuideHint(true);
            }, 9000);
        }

        function handleLipstickTap(l) {
            if (l.state === 'in') {
                l.group.updateWorldMatrix(true, false);
                scene.attach(l.group); // conserva la posición actual y pasa al mundo
                l.start = l.group.position.clone();
                l.startQ = l.group.quaternion.clone();
                l.mid = new THREE.Vector3(l.start.x * 0.4, 6.0, l.start.z + 2.2);
                if (l.fixedTarget) {
                    l.target = l.fixedTarget;
                    showFloatingBanner(l.msg, true);
                } else {
                    l.target = lipSlot(lipsOut);
                    showFloatingBanner(LIP_MESSAGES[lipsOut], true);
                    lipsOut++;
                }
                l.s0 = l.group.scale.x;
                l.state = 'fly'; l.t = 0; l.trail = 0;
                soundEngine.playChime([523.25, 783.99, 1046.50], 0.5, 0.05, 0.09);
                spawnSparkleBurst(l.start.clone().add(new THREE.Vector3(0, 0.5, 0)), 22);

                // Actualizamos el indicador de lo siguiente que falta por sacar
                setTimeout(() => {
                    updateBoxGuideHint(false);
                }, 1200);
            } else if (l.state === 'float') {
                l.spin = 1; // vuelta de celebración
                if (l.isPerfume) {
                    soundEngine.playPerfumeSpray();
                    showFloatingBanner(l.msg, true);
                } else {
                    soundEngine.playPerfumeSpray();
                }
                spawnSparkleBurst(l.group.position.clone(), 18);
                // Si aún faltan cosas adentro y toca algo de afuera, le recordamos suavemente
                const anyIn = lipsticks.some(x => x.state === 'in');
                if (anyIn) {
                    setTimeout(() => updateBoxGuideHint(false), 1800);
                }
            }
        }

        function updateLipsticks(delta, elapsed) {
            lipsticks.forEach(l => {
                if (l.state === 'fly') {
                    l.t = Math.min(1, l.t + delta / 1.7);
                    const t = l.t, e = 1 - Math.pow(1 - t, 3);
                    // curva de Bézier cuadrática: sale de la caja, sube alto y cae al lugar
                    const a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e;
                    l.group.position.set(
                        a * l.start.x + b * l.mid.x + c * l.target.x,
                        a * l.start.y + b * l.mid.y + c * l.target.y,
                        a * l.start.z + b * l.mid.z + c * l.target.z);
                    // gira y da volteretas mientras se endereza
                    _qA.copy(l.startQ);
                    _qB.set(0, 0, 0, 1);
                    _qA.slerp(_qB, e);
                    _qS.setFromAxisAngle(_Y, e * Math.PI * 4);
                    _qA.premultiply(_qS);
                    _qS.setFromAxisAngle(_X, Math.sin(t * Math.PI) * Math.PI * 2);
                    _qA.premultiply(_qS);
                    l.group.quaternion.copy(_qA);
                    l.group.scale.setScalar(l.s0 + e * ((l.finalScale || LIP_SCALE) - l.s0) + Math.sin(t * Math.PI) * 0.4);
                    // la tapa dorada se levanta y gira al llegar
                    const ct = Math.max(0, (t - 0.65) / 0.35);
                    l.cap.position.y = (l.capY || 0.58) + Math.sin(ct * Math.PI) * 0.55;
                    l.cap.rotation.y = ct * Math.PI * 4;
                    l.trail += delta;
                    if (l.trail > 0.07) { l.trail = 0; spawnSparkleBurst(l.group.position, 2); }
                    if (t >= 1) {
                        l.state = 'float';
                        l.cap.position.y = l.capY || 0.58; l.cap.rotation.y = 0;
                        l.group.position.copy(l.target);
                        spawnSparkleBurst(l.target, 30);
                        soundEngine.playChime([1318.51, 1567.98], 0.4, 0.05, 0.1);
                    }
                } else if (l.state === 'float') {
                    l.spin = Math.max(0, l.spin - delta * 0.6);
                    l.group.rotation.y += l.spin * 0.35; // quieto; solo gira si lo tocas
                }
            });
        }

        function onPointerMove(event) {
            const container = document.getElementById('canvas-container');
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const interactiveAll = !isBoxOpened
                ? (isUnwrapping ? [] : bowInteractiveMeshes)
                : [...cardInteractiveMeshes, ...perfumeInteractiveMeshes, ...butterflyGroups.map(b => b.group)];
            const hits = raycaster.intersectObjects(interactiveAll, true);
            container.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
        }

        function onPointerUp() {}

        function openGiftBox() {
            if (isBoxOpened) return;
            isBoxOpened = true;
            bowInteractiveMeshes.forEach(m => m.visible = false);
            targetLidAngle = -Math.PI * 0.66;

            soundEngine.playBoxOpenMagic();
            triggerBoxOpenCelebration();
            showFloatingBanner('¡Feliz Cumpleaños! ✨');

            updateBoxGuideHint(false);
            startReminderWatcher();
            document.getElementById('btn-album-shortcut').classList.remove('hidden');
        }

        function onWindowResize() {
            const container = document.getElementById('canvas-container');
            if (!camera || !renderer || !container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            applyFrame();
        }

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            if (isUnwrapping && !isBoxOpened) {
                unwrapP = Math.min(1, unwrapP + delta / UNWRAP_SECONDS);
                const f = Math.max(0, (unwrapP - 0.1) / 0.9) * 1.9;
                peelRibbons.forEach(r => r.update(f));
                if (bowGroup) {
                    const s = Math.min(1, unwrapP / 0.22), e = s * s * (3 - 2 * s);
                    bowGroup.rotation.y = e * 5 + Math.sin(elapsed * 14) * 0.08 * (1 - e);
                    bowGroup.rotation.z = Math.sin(elapsed * 10) * 0.12 * (1 - e);
                    bowGroup.position.y = 0.62 + e * 0.9;
                    bowGroup.scale.setScalar(Math.max(0.001, 1 - e));
                    bowGroup.visible = e < 1;
                }
                if (unwrapP >= 1) {
                    peelRibbons.forEach(r => r.mesh.visible = false);
                    openGiftBox();
                }
            } else if (!isBoxOpened && bowGroup) {
                bowGroup.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.04);
            }

            if (lidPivot) {
                currentLidAngle += (targetLidAngle - currentLidAngle) * 0.055;
                lidPivot.rotation.x = currentLidAngle;
            }

            if (isBoxOpened && fresitaCard3D && albumEntry && albumEntry.state === 'in') {
                cardPopProgress = Math.min(1, cardPopProgress + delta * 0.9);
                const ease = 1 - Math.pow(1 - cardPopProgress, 3);
                fresitaCard3D.position.y = 0.75 + ease * 0.45 + Math.sin(elapsed * 2.5) * 0.04;
                fresitaCard3D.position.z = -0.15 + ease * 0.45;
                fresitaCard3D.rotation.x = -0.35 + ease * 0.25;
            }

            if (boxGroup && !isBoxOpened) {
                boxGroup.position.y = -0.35 + Math.sin(elapsed * 2.0) * 0.06;
            } else if (boxGroup) {
                boxGroup.position.y += (-0.35 - boxGroup.position.y) * 0.08;
            }

            updateLipsticks(delta, elapsed);

            ambientFloaters.forEach(item => {
                item.mesh.position.y = item.baseY + Math.sin(elapsed * item.speed + item.offset) * 0.28;
                item.mesh.rotation.y += item.rotSpeed;
                item.mesh.rotation.x += item.rotSpeed * 0.5;
            });

            butterflyGroups.forEach((b, idx) => {
                const speedMult = 1 + b.spinBoost * 4.5;
                b.angle += b.speed * delta * speedMult;
                if (b.spinBoost > 0) {
                    b.spinBoost = Math.max(0, b.spinBoost - delta * 0.7);
                }

                const r = b.radius + Math.sin(elapsed * 1.5 + idx) * 0.35;
                b.group.position.x = Math.cos(b.angle) * r;
                b.group.position.z = Math.sin(b.angle) * r;
                b.group.position.y = b.baseY + Math.sin(elapsed * 2.4 + idx) * 0.35 + b.spinBoost * 0.6;

                b.group.rotation.y = -b.angle;
                b.group.rotation.z = Math.sin(elapsed * 3 + idx) * 0.15;

                const flap = Math.sin(elapsed * (b.flapSpeed + b.spinBoost * 10)) * 0.75;
                b.leftWing.rotation.y = flap;
                b.rightWing.rotation.y = -flap;
            });

            for (let i = balloons.length - 1; i >= 0; i--) {
                const bl = balloons[i];
                bl.wobble += delta * 2.5;
                bl.mesh.position.y += bl.vy;
                bl.mesh.position.x += bl.vx + Math.sin(bl.wobble) * 0.008;
                bl.mesh.position.z += bl.vz + Math.cos(bl.wobble) * 0.008;
                bl.mesh.rotation.y += 0.015;

                if (bl.mesh.position.y > 12) {
                    scene.remove(bl.mesh);
                    balloons.splice(i, 1);
                }
            }

            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                const pt = confettiParticles[i];
                pt.mesh.position.x += pt.vx;
                pt.mesh.position.y += pt.vy;
                pt.mesh.position.z += pt.vz;
                pt.vy -= 0.0018;
                pt.mesh.rotation.x += pt.rotSpeed;
                pt.mesh.rotation.y += pt.rotSpeed;
                pt.life -= delta * 0.45;
                pt.mesh.material.opacity = Math.max(0, pt.life);

                if (pt.life <= 0) {
                    scene.remove(pt.mesh);
                    confettiParticles.splice(i, 1);
                }
            }

            const frameGoal = isBoxOpened ? 1 : 0;
            if (Math.abs(frameT - frameGoal) > 0.001) {
                frameT += (frameGoal - frameT) * Math.min(1, delta * 2.2);
                if (Math.abs(frameT - frameGoal) <= 0.001) frameT = frameGoal;
                applyFrame();
            }

            controls.update();
            renderer.render(scene, camera);
        }

        function populateWelcomeDecorations() {
            const bg = document.getElementById('welcome-bg-decor');
            const emojis = ['🍓', '🌸', '✨', '💖', '🦋'];
            for (let i = 0; i < 18; i++) {
                const span = document.createElement('span');
                span.className = 'bg-floater text-lg sm:text-2xl opacity-60';
                span.textContent = emojis[i % emojis.length];
                span.style.left = `${Math.random() * 94}%`;
                span.style.top = `${Math.random() * 94}%`;
                span.style.animationDelay = `${Math.random() * 4}s`;
                span.style.animationDuration = `${4.5 + Math.random() * 3.5}s`;
                bg.appendChild(span);
            }
        }

        function renderAlbumGrid() {
            const grid = document.getElementById('album-grid');
            grid.innerHTML = '';

            albumCardsData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'polaroid-card flex flex-col items-center';
                card.innerHTML = `
                    <div class="w-full aspect-square rounded-[14px] overflow-hidden border border-pink-100 mb-2.5 bg-pink-50">
                        <img src="${item.dataUrl}" alt="${item.title}" class="w-full h-full object-cover">
                    </div>
                    <p class="font-script text-xl sm:text-2xl text-[#6e2b3d] text-center leading-tight">
                        ${item.title}
                    </p>
                `;
                card.addEventListener('click', () => openPhotoZoom(item));
                grid.appendChild(card);
            });
        }

        function openAlbumModal() {
            const modal = document.getElementById('album-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
            });
        }

        function closeAlbumModal() {
            const modal = document.getElementById('album-modal');
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                if (isBoxOpened && lipsticks.some(x => x.state === 'in')) {
                    updateBoxGuideHint(true);
                }
            }, 400);
        }

        function openPhotoZoom(item) {
            soundEngine.playChime([783.99, 987.77, 1318.51], 0.5, 0.05, 0.1);
            const zoomModal = document.getElementById('photo-zoom-modal');
            const zoomCard = document.getElementById('zoom-card-container');
            const heartsLayer = document.getElementById('zoom-hearts-layer');

            document.getElementById('zoom-image').src = item.dataUrl;
            document.getElementById('zoom-caption').textContent = item.title;

            zoomModal.classList.remove('hidden');
            zoomModal.classList.add('flex');
            requestAnimationFrame(() => {
                zoomCard.classList.remove('scale-95');
                zoomCard.classList.add('scale-100');
            });

            heartsLayer.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const h = document.createElement('span');
                h.className = 'modal-heart text-xl';
                h.textContent = i % 2 === 0 ? '💖' : '🍓';
                h.style.left = `${10 + Math.random() * 80}%`;
                h.style.bottom = '15%';
                h.style.animationDelay = `${i * 0.18}s`;
                heartsLayer.appendChild(h);
            }
        }

        function closePhotoZoom() {
            const zoomModal = document.getElementById('photo-zoom-modal');
            const zoomCard = document.getElementById('zoom-card-container');
            zoomCard.classList.remove('scale-100');
            zoomCard.classList.add('scale-95');
            setTimeout(() => {
                zoomModal.classList.add('hidden');
                zoomModal.classList.remove('flex');
            }, 220);
        }

        document.getElementById('custom-photo-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                albumCardsData[3].dataUrl = ev.target.result;
                albumCardsData[3].title = 'Un Lindo Recuerdo ✨';
                renderAlbumGrid();
                soundEngine.playChime([523.25, 659.25, 783.99, 1046.50], 0.6, 0.06, 0.1);
            };
            reader.readAsDataURL(file);
        });

        window.onload = function () {
            populateWelcomeDecorations();
            renderAlbumGrid();
            const loadFonts = Promise.all([
                document.fonts.load('130px "Great Vibes"'),
                document.fonts.load('bold 52px "Playfair Display"')
            ]).catch(() => {});
            Promise.race([loadFonts, new Promise(r => setTimeout(r, 2500))]).then(() => {
                initThreeScene();
                animate();
            });

            document.getElementById('btn-open-experience').addEventListener('click', () => {
                soundEngine.init();
                soundEngine.playChime([523.25, 659.25, 783.99, 1046.50], 0.8, 0.07, 0.12);
                soundEngine.startAmbientMelody();

                const welcome = document.getElementById('welcome-screen');
                const card = document.getElementById('welcome-card');
                card.style.transform = 'scale(0.92) translateY(-20px)';
                welcome.style.opacity = '0';

                setTimeout(() => {
                    welcome.style.display = 'none';
                    document.getElementById('canvas-wrapper').classList.add('visible');
                    onWindowResize();
                }, 850);
            });

            document.getElementById('btn-sound-toggle').addEventListener('click', () => {
                const active = soundEngine.toggle();
                document.getElementById('icon-sound-on').classList.toggle('hidden', !active);
                document.getElementById('icon-sound-off').classList.toggle('hidden', active);
            });

            document.getElementById('btn-album-shortcut').addEventListener('click', openAlbumModal);
            document.getElementById('btn-close-album').addEventListener('click', closeAlbumModal);
            document.getElementById('album-modal').addEventListener('click', (e) => {
                if (e.target.id === 'album-modal') closeAlbumModal();
            });
            document.getElementById('photo-zoom-modal').addEventListener('click', closePhotoZoom);
        };
    

