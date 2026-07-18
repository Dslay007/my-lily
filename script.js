/* ============================================
   ROMANTIC ANNIVERSARY WEBSITE - JAVASCRIPT
   ============================================ */

// ===== STATE =====
let currentScene = 'landing';
let uploadedPhotos = [];
let miniFireworksCanvas = null;
let miniFireworksCtx = null;
let experienceStarted = false;  // guard so tap only fires once

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
    setupNavigation();
    loadGallery();
    loadTimeline();
    setupCursorTrail();
    setupLandingTap();  // setup tap/click on landing
});

// ===== STARS BACKGROUND =====
function createStars() {
    const container = document.getElementById('starsBg');
    if (!container) return;
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.width = (1 + Math.random() * 3) + 'px';
        star.style.height = star.style.width;
        container.appendChild(star);
    }
}

// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particlesBg');
    if (!container) return;
    const colors = ['#e91e63', '#ff6090', '#f48fb1', '#ffd700', '#ff80ab'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 4 + Math.random() * 12;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.setProperty('--dur', (6 + Math.random() * 10) + 's');
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}

// ===== CURSOR HEART TRAIL =====
function setupCursorTrail() {
    const hearts = ['💕', '💖', '💗', '❤️', '✨', '🌸'];
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 80) return;
        lastTime = now;

        const trail = document.createElement('div');
        trail.className = 'trail-heart';
        trail.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.getElementById('cursorTrail').appendChild(trail);

        setTimeout(() => trail.remove(), 1000);
    });
}

// ============================================
// BACKGROUND MUSIC
// ============================================
function playBgMusic(videoId) {
    const player = document.getElementById('bgMusicPlayer');
    if (!player) return;
    // autoplay=1 works after user gesture (tap already triggered this)
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&loop=1&playlist=${videoId}`;
}

// ===== LANDING TAP SETUP (click + touchstart for mobile) =====
function setupLandingTap() {
    const landing = document.getElementById('landing');
    if (!landing) return;

    function onTap(e) {
        e.preventDefault();
        startExperience();
    }

    // Both click and touchstart for maximum compatibility
    landing.addEventListener('click', onTap);
    landing.addEventListener('touchstart', onTap, { passive: false });

    // Also set cursor style
    landing.style.cursor = 'pointer';
}

// ============================================
// SCENE TRANSITIONS
// ============================================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    screen.classList.add('active');
    currentScene = id;
}

function startExperience() {
    if (experienceStarted) return;  // prevent double-fire
    experienceStarted = true;

    // Play music IMMEDIATELY on tap (browser allows autoplay right after user gesture)
    playBgMusic('0KSOMA3QBU0');  // Girl Like You - Maroon 5

    // Visual feedback on landing
    const landing = document.getElementById('landing');
    landing.style.transition = 'opacity 0.5s';
    landing.style.opacity = '0.7';

    setTimeout(() => {
        showScreen('flowerScene');
        startFlowerRain();
        typeFlowerMessage();
    }, 500);
}


// ============================================
// FLOWER RAIN SCENE
// ============================================
function startFlowerRain() {
    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];
    const flowerEmojis = ['🌸', '🌺', '🌹', '🌷', '💐', '🌻', '🏵️', '💮', '🌼', '🌿'];

    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * -canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -30;
            this.size = 14 + Math.random() * 22;
            this.speed = 1 + Math.random() * 2.5;
            this.wind = Math.sin(Date.now() / 2000) * 0.5 + (Math.random() - 0.5) * 0.8;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 3;
            this.emoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
            this.opacity = 0.7 + Math.random() * 0.3;
            this.sway = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.02 + Math.random() * 0.03;
        }

        update() {
            this.y += this.speed;
            this.sway += this.swaySpeed;
            this.x += this.wind + Math.sin(this.sway) * 0.8;
            this.rotation += this.rotSpeed;

            if (this.y > canvas.height + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.font = this.size + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }
    }

    // Create petals
    for (let i = 0; i < 60; i++) {
        petals.push(new Petal());
    }

    let animId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        animId = requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Transition to fireworks after 7 seconds
    setTimeout(() => {
        cancelAnimationFrame(animId);
        showScreen('fireworkScene');
        startFireworks();
    }, 7000);
}

function typeFlowerMessage() {
    const messages = [
        "Setiap bunga ini melambangkan cintaku padamu...",
        "Yang tak pernah layu, tak pernah pudar...",
        "Seperti cintaku yang abadi untukmu 💕"
    ];

    const el = document.getElementById('flowerText');
    const subEl = document.getElementById('flowerSub');
    let msgIndex = 0;
    let charIndex = 0;

    function type() {
        if (msgIndex >= messages.length) {
            subEl.style.opacity = '1';
            subEl.textContent = '✨ Bersiap untuk kejutan berikutnya... ✨';
            return;
        }

        const currentMsg = messages[msgIndex];
        if (charIndex < currentMsg.length) {
            el.textContent = currentMsg.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 50);
        } else {
            msgIndex++;
            charIndex = 0;
            setTimeout(() => {
                el.textContent = '';
                type();
            }, 1500);
        }
    }

    type();
}

// ============================================
// FIREWORKS SCENE
// ============================================
function startFireworks() {
    const canvas = document.getElementById('fireworkCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = 100 + Math.random() * (canvas.height * 0.4);
            this.speed = 4 + Math.random() * 3;
            this.trail = [];
            this.exploded = false;
            this.hue = Math.random() * 360;
        }

        update() {
            if (!this.exploded) {
                this.trail.push({ x: this.x, y: this.y, alpha: 1 });
                if (this.trail.length > 8) this.trail.shift();

                this.y -= this.speed;
                this.x += (Math.random() - 0.5) * 0.5;

                if (this.y <= this.targetY) {
                    this.explode();
                }
            }
        }

        explode() {
            this.exploded = true;
            const count = 60 + Math.random() * 40;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                const speed = 2 + Math.random() * 4;
                particles.push(new Particle(this.x, this.y, angle, speed, this.hue));
            }
        }

        draw() {
            if (!this.exploded) {
                // Trail
                this.trail.forEach((t, i) => {
                    t.alpha -= 0.12;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${t.alpha})`;
                    ctx.fill();
                });

                // Head
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
                ctx.fill();
                ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    class Particle {
        constructor(x, y, angle, speed, hue) {
            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.hue = hue + (Math.random() - 0.5) * 30;
            this.size = 1.5 + Math.random() * 2;
            this.decay = 0.012 + Math.random() * 0.015;
            this.gravity = 0.04;
            this.trail = [];
        }

        update() {
            this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
            if (this.trail.length > 5) this.trail.shift();

            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.alpha -= this.decay;
        }

        draw() {
            // Trail
            this.trail.forEach(t => {
                ctx.beginPath();
                ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${t.alpha * 0.3})`;
                ctx.fill();
            });

            // Particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            ctx.fill();
            ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    let frameCount = 0;
    let animId;

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        frameCount++;
        if (frameCount % 30 === 0 || frameCount === 1) {
            fireworks.push(new Firework());
            if (Math.random() > 0.5) fireworks.push(new Firework());
        }

        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].exploded) {
                fireworks.splice(i, 1);
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        animId = requestAnimationFrame(animate);
    }

    animate();

    // Update countdown
    updateCountdown();

    // Transition to main content after 8 seconds & play Girl Like You
    setTimeout(() => {
        cancelAnimationFrame(animId);
        showScreen('mainContent');
        playBgMusic('0KSOMA3QBU0');  // Girl Like You - Maroon 5
    }, 8000);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function updateCountdown() {
    const container = document.getElementById('countdownLove');
    // Example: anniversary date - customize this!
    const now = new Date();
    const items = [
        { number: '∞', label: 'Hari Cinta' },
        { number: '365+', label: 'Hari Bersama' },
        { number: '∞', label: 'Pelukan' },
        { number: '∞', label: 'I Love You' }
    ];

    container.innerHTML = items.map(item => `
        <div class="countdown-item">
            <span class="countdown-number">${item.number}</span>
            <span class="countdown-label">${item.label}</span>
        </div>
    `).join('');
}

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            // Update nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update sections
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active-section'));
            document.getElementById(section).classList.add('active-section');
        });
    });
}

// ============================================
// GALLERY
// ============================================
function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    const defaultPhotos = [
        { emoji: '💑', caption: 'Us Together', color: 'linear-gradient(135deg, #e91e63, #9c27b0)' },
        { emoji: '🌅', caption: 'Our Sunset', color: 'linear-gradient(135deg, #ff6f00, #e91e63)' },
        { emoji: '☕', caption: 'Coffee Dates', color: 'linear-gradient(135deg, #795548, #4e342e)' },
        { emoji: '🎂', caption: 'Birthday Joy', color: 'linear-gradient(135deg, #ffd700, #ff6090)' },
        { emoji: '🏖️', caption: 'Beach Memories', color: 'linear-gradient(135deg, #00bcd4, #2196f3)' },
        { emoji: '🌃', caption: 'Night Out', color: 'linear-gradient(135deg, #1a237e, #4a148c)' },
        { emoji: '🎄', caption: 'Holidays', color: 'linear-gradient(135deg, #2e7d32, #c62828)' },
        { emoji: '🎵', caption: 'Our Song', color: 'linear-gradient(135deg, #6a1b9a, #e91e63)' },
        { emoji: '🍕', caption: 'Food Adventures', color: 'linear-gradient(135deg, #e65100, #fdd835)' }
    ];

    grid.innerHTML = defaultPhotos.map((photo, i) => `
        <div class="gallery-item" style="animation-delay: ${i * 0.1}s">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${photo.color};font-size:4rem;">
                ${photo.emoji}
            </div>
            <div class="overlay">
                <p>${photo.caption}</p>
            </div>
        </div>
    `).join('');
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    const grid = document.getElementById('galleryGrid');

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.onclick = () => openGalleryItem(item);
            item.innerHTML = `
                <img src="${e.target.result}" alt="Our Memory">
                <div class="overlay">
                    <p>💕 Kenangan Kita</p>
                </div>
            `;
            grid.insertBefore(item, grid.firstChild);
        };
        reader.readAsDataURL(file);
    });
}

function openGalleryItem(item) {
    const img = item.querySelector('img');
    if (img) {
        document.getElementById('lightboxImg').src = img.src;
        document.getElementById('lightbox').classList.add('show');
    }
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
}

// ============================================
// TIMELINE
// ============================================
function loadTimeline() {
    const container = document.getElementById('timelineContainer');
    const events = [
        {
            emoji: '💫',
            date: 'Hari Pertama',
            title: 'Pertama Kali Bertemu',
            desc: 'Saat pertama mata ini melihatmu, aku tahu ada sesuatu yang istimewa tentangmu. Jantungku berdebar begitu kencang...'
        },
        {
            emoji: '💬',
            date: 'Hari-hari Berikutnya',
            title: 'Mulai Saling Chat',
            desc: 'Dari obrolan yang canggung menjadi obrolan yang tak ada habisnya. Setiap malam terasa terlalu singkat untuk bicara denganmu.'
        },
        {
            emoji: '☕',
            date: 'Date Pertama',
            title: 'First Date',
            desc: 'Masih ingat betapa groginya aku? Tapi senyummu membuat semua rasa gugup itu hilang seketika.'
        },
        {
            emoji: '💝',
            date: 'Hari Spesial',
            title: 'Resmi Jadian!',
            desc: 'Akhirnya aku memberanikan diri... dan kamu bilang "Iya!" Hari paling membahagiakan dalam hidupku! 🎉'
        },
        {
            emoji: '🌟',
            date: 'Setiap Hari',
            title: 'Melewati Suka & Duka',
            desc: 'Bersama kamu, bahkan hari yang buruk pun terasa tidak seburuk itu. Terima kasih selalu ada di sisiku.'
        },
        {
            emoji: '🎊',
            date: 'Hari Ini',
            title: 'Happy Anniversary!',
            desc: 'Dan hari ini kita merayakan cinta kita! Terima kasih sudah menjadi bagian terbaik dalam hidupku. Aku mencintaimu! ❤️'
        }
    ];

    container.innerHTML = events.map(event => `
        <div class="timeline-item">
            <div class="timeline-emoji">${event.emoji}</div>
            <div class="timeline-date">${event.date}</div>
            <h3 class="timeline-title">${event.title}</h3>
            <p class="timeline-desc">${event.desc}</p>
        </div>
    `).join('');
}

// ============================================
// BACKGROUND MUSIC
// ============================================
function playBgMusic(videoId) {
    const player = document.getElementById('bgMusicPlayer');
    if (!player) return;
    // autoplay=1&mute=0 — works after user interaction (tap already happened)
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&loop=1&playlist=${videoId}`;
}

// ============================================
// YOUTUBE MUSIC
// ============================================
function loadYouTubeVideo(videoId) {
    const player = document.getElementById('ytPlayer');
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

    // Spin vinyl
    const vinyl = document.getElementById('vinylRecord');
    vinyl.classList.add('spinning');
}

function searchYouTube() {
    const query = document.getElementById('ytSearchInput').value.trim();
    if (!query) return;

    // Use YouTube search URL embedded
    const searchUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
    const player = document.getElementById('ytPlayer');
    player.src = searchUrl;

    const vinyl = document.getElementById('vinylRecord');
    vinyl.classList.add('spinning');
}

// ============================================
// FAB ACTIONS (Interactive Buttons)
// ============================================
function triggerFireworks() {
    const emojis = ['🎆', '🎇', '✨', '💥', '⭐', '🌟'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingEmoji(
                emojis[Math.floor(Math.random() * emojis.length)],
                Math.random() * window.innerWidth,
                window.innerHeight + 20,
                2 + Math.random() * 3
            );
        }, i * 100);
    }
}

function triggerFlowerRain() {
    const flowers = ['🌸', '🌺', '🌹', '🌷', '💐', '🌼', '🌻', '🏵️'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFloatingEmoji(
                flowers[Math.floor(Math.random() * flowers.length)],
                Math.random() * window.innerWidth,
                window.innerHeight + 30,
                3 + Math.random() * 5
            );
        }, i * 80);
    }
}

function triggerHeartExplosion() {
    const hearts = ['💖', '💕', '💗', '❤️', '💝', '💞', '💓', '💘'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const angle = (Math.PI * 2 / 25) * i;
            const distance = 50 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            createFloatingEmoji(
                hearts[Math.floor(Math.random() * hearts.length)],
                x, y,
                2 + Math.random() * 3
            );
        }, i * 60);
    }
}

function createFloatingEmoji(emoji, x, y, duration) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--dur', duration + 's');
    el.style.setProperty('--size', (1.5 + Math.random() * 2) + 'rem');
    document.body.appendChild(el);

    setTimeout(() => el.remove(), duration * 1000);
}

// ============================================
// LIGHTBOX KEYBOARD
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    const canvases = ['flowerCanvas', 'fireworkCanvas'];
    canvases.forEach(id => {
        const c = document.getElementById(id);
        if (c) {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
        }
    });
});
