// ============================================
// HAPPY BIRTHDAY LILY - MAIN SCRIPT
// ============================================

// ===== DATA =====
const GALLERY = [
    { emoji: '🤣', color: '#ffb3d9', caption: 'Endless Laughs', sub: 'Remember this?' },
    { emoji: '🍜', color: '#ffd1dc', caption: 'Food Dates', sub: 'Never stop eating' },
    { emoji: '🎬', color: '#c084fc', caption: 'Movie Night', sub: 'Scary but fun!' },
    { emoji: '🥺', color: '#ff7c7c', caption: 'Deep Talks', sub: 'Until 3 AM' },
    { emoji: '🛍️', color: '#ffe4e1', caption: 'Shopping', sub: 'Broke together' },
    { emoji: '✨', color: '#f3e8ff', caption: 'Today', sub: 'You look gorgeous!' }
];

// ===== PROCEDURAL PLANT GENERATION =====
const FLOWER_PALETTES = [
    { c1:'#ff8fb1', c2:'#ff2d78', cc:'#ff1493' }, // Pink
    { c1:'#fda4af', c2:'#e11d48', cc:'#f43f5e' }, // Rose
    { c1:'#d8b4fe', c2:'#9333ea', cc:'#a855f7' }, // Purple
    { c1:'#c4b5fd', c2:'#7c3aed', cc:'#8b5cf6' }, // Violet
    { c1:'#c084fc', c2:'#7c3aed', cc:'#a78bfa' }, // Lavender
    { c1:'#fde68a', c2:'#f59e0b', cc:'#ffd700' }, // Gold
    { c1:'#fdba74', c2:'#ea580c', cc:'#fb923c' }, // Orange
];

function generatePlants() {
    const plants = [];
    function centrality(x) { return 1 - Math.abs(x - 50) / 50; }

    const totalPlants = 45;
    const spacing = 100 / totalPlants;
    
    for (let i = 0; i < totalPlants; i++) {
        // Evenly distribute X with slight jitter for a structured but natural look
        let x = (i * spacing) + (Math.random() * spacing * 0.5);
        x = Math.max(1, Math.min(99, x));
        const c = centrality(x);

        // No foliage, only uniform flowers
        const isFoliage = false;
        
        // Random size multiplier independent of position
        const sizeMult = 0.7 + Math.random() * 0.8; 
        const delay = Math.random() * 0.8;
        const swayDur = 3.0 + Math.random() * 2.5;
        const swayAngle = (1.5 + Math.random() * 3.5) * (Math.random() > 0.5 ? 1 : -1);

        const palette = FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];
        // Uniform shape for all flowers
        const shape = 'daisy'; 
        
        let w = Math.floor(40 * sizeMult);
        let h = Math.floor(40 * sizeMult);

        plants.push({
            type: 'flower', shape, x, w, h,
            c1: palette.c1, c2: palette.c2, cc: palette.cc,
            np: 8, // Uniform number of petals
            ps: Math.floor(16 * sizeMult),
            cr: Math.floor(8 * sizeMult),
            d: delay, sd: swayDur, sa: swayAngle
        });
    }
    plants.sort((a, b) => a.x - b.x + (Math.random() - 0.5) * 8);
    return plants;
}

// ===== PROCEDURAL BUTTERFLY GENERATION =====
function generateButterflies() {
    const container = document.getElementById('butterfliesContainer');
    if (!container) return;
    
    const count = 12; // 6 left, 6 right
    for (let i = 0; i < count; i++) {
        const b = document.createElement('div');
        b.className = 'butterfly ' + (i % 2 === 0 ? 'left' : 'right');
        b.innerHTML = '🦋';
        
        // Randomize size, position, duration, and delay
        const size = (1.5 + Math.random() * 2).toFixed(1) + 'rem'; // 1.5rem to 3.5rem
        const top = (10 + Math.random() * 70).toFixed(0) + '%'; // 10% to 80% top
        const duration = (12 + Math.random() * 15).toFixed(1) + 's'; // 12s to 27s
        
        // Let them start immediately or with slight delay so they gerudukan
        const delay = (Math.random() * -20).toFixed(1) + 's'; // negative delay means they are already on screen!
        
        b.style.fontSize = size;
        b.style.top = top;
        b.style.setProperty('--fly-dur', duration);
        b.style.setProperty('--fly-del', delay);
        
        container.appendChild(b);
    }
}

function buildFlowerSVG(cfg) {
    const id = 'fl' + Math.floor(Math.random() * 1e8);
    const FY = 55;
    const stemTop = FY + (cfg.cr || 5) + 2;

    let flowerHead = '';
    
    if (cfg.shape === 'lavender') {
        let blooms = '';
        const count = 10 + Math.floor(Math.random() * 8);
        for (let i = 0; i < count; i++) {
            const by = FY - (i * 3.5);
            const bx = (Math.random() - 0.5) * 12;
            const size = 3 + Math.random() * 3;
            blooms += `<circle cx="${40+bx}" cy="${by}" r="${size}" fill="${cfg.c2}" opacity="0.9"/>`;
            blooms += `<circle cx="${40+bx-1}" cy="${by-1}" r="${size*0.5}" fill="${cfg.c1}" opacity="0.8"/>`;
        }
        flowerHead = `<path d="M40,${FY+10} L40,${FY-count*3.5}" stroke="#4a8c50" stroke-width="3"/>${blooms}`;
    } else if (cfg.shape === 'tulip') {
        flowerHead = `
        <path d="M30,${FY+10} Q20,${FY-20} 40,${FY-25} Q60,${FY-20} 50,${FY+10} Z" fill="url(#pg-${id})"/>
        <path d="M40,${FY+10} Q35,${FY-15} 40,${FY-25} Q45,${FY-15} 40,${FY+10} Z" fill="${cfg.c1}" opacity="0.8"/>
        `;
    } else {
        let petals = '';
        for (let i = 0; i < cfg.np; i++) {
            const angle = (360 / cfg.np) * i;
            petals += `<ellipse cx="0" cy="${-(cfg.ps*1.35)}" rx="${cfg.ps*0.52}" ry="${cfg.ps}"
                fill="url(#pg-${id})" opacity="0.94" transform="rotate(${angle})"/>`;
        }
        flowerHead = `
            <g transform="translate(40,${FY})">${petals}</g>
            <circle cx="40" cy="${FY}" r="${cfg.cr}" fill="url(#cg-${id})"/>
            <circle cx="40" cy="${FY}" r="${cfg.cr*0.48}" fill="${cfg.cc}" opacity="0.95"/>
            <circle cx="${40-cfg.cr*0.3}" cy="${FY-cfg.cr*0.3}" r="${cfg.cr*0.22}" fill="#fff" opacity="0.55"/>
        `;
    }

    return `
    <svg viewBox="0 0 80 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="pg-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${cfg.c1}"/><stop offset="100%" stop-color="${cfg.c2}" stop-opacity="0.82"/>
        </linearGradient>
        <radialGradient id="cg-${id}" cx="40%" cy="35%">
          <stop offset="0%" stop-color="#ffffffcc"/><stop offset="50%" stop-color="${cfg.c1}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${cfg.c2}"/>
        </radialGradient>
      </defs>
      <path d="M40,${stemTop} Q37,180 40,300" stroke="#3d7a42" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="26" cy="${stemTop+55}" rx="15" ry="5" fill="#3d7a42" opacity="0.88" transform="rotate(-35,26,${stemTop+55})"/>
      <ellipse cx="54" cy="${stemTop+85}" rx="15" ry="5" fill="#3d7a42" opacity="0.88" transform="rotate(35,54,${stemTop+85})"/>
      ${flowerHead}
    </svg>`;
}

function buildFoliageSVG() {
    const id = 'fg' + Math.floor(Math.random() * 1e8);
    const leafCount = 3 + Math.floor(Math.random() * 4);
    const stemCurve = (Math.random() - 0.5) * 20;
    const greens = ['#2a5e30','#3d7a42','#4a8c50','#2d6e35','#224a25'];
    const stemColor = greens[Math.floor(Math.random() * greens.length)];
    const stemEnd = 40 + Math.random() * 40;

    let leaves = '';
    for (let i = 0; i < leafCount; i++) {
        const ly = stemEnd + 20 + ((300 - stemEnd - 20) / (leafCount + 1)) * (i + 1);
        const side = i % 2 === 0 ? -1 : 1;
        const lx = 40 + side * (10 + Math.random() * 8);
        const lw = 15 + Math.random() * 12;
        const lh = 6 + Math.random() * 5;
        const angle = side * (30 + Math.random() * 20);
        leaves += `<ellipse cx="${lx}" cy="${ly}" rx="${lw}" ry="${lh}" fill="${stemColor}" opacity="${0.8+Math.random()*0.2}" transform="rotate(${angle},${lx},${ly})"/>`;
    }

    return `
    <svg viewBox="0 0 80 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <path d="M40,300 Q${40+stemCurve},${150} 40,${stemEnd}" stroke="${stemColor}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${leaves}
    </svg>`;
}

function createFlowers() {
    const container = document.getElementById('flowersContainer');
    if (!container) return;
    container.innerHTML = '';

    const allPlants = generatePlants();
    generateButterflies();
    allPlants.forEach(cfg => {
        const pos = document.createElement('div');
        pos.className = 'flower-pos';
        pos.style.left = cfg.x + '%';
        pos.style.width = cfg.w + 'px';

        const sway = document.createElement('div');
        sway.className = 'flower-sway';
        sway.style.setProperty('--sway-dur', cfg.sd + 's');
        sway.style.setProperty('--sway-delay', (Math.random()*2) + 's');
        sway.style.setProperty('--sway-angle', cfg.sa + 'deg');

        const grow = document.createElement('div');
        grow.className = 'flower-grow';
        grow.style.setProperty('--delay', cfg.d + 's');
        grow.innerHTML = cfg.type === 'flower' ? buildFlowerSVG(cfg) : buildFoliageSVG();

        sway.appendChild(grow);
        pos.appendChild(sway);
        container.appendChild(pos);
    });
}

// ===== TYPEWRITER =====
let twTimer;
function typewriterBirthday() {
    const titleEl = document.getElementById('birthdayTypewriter');
    const subEl = document.getElementById('birthdaySub');
    const text = 'Happy Birthday, Lily!';
    let i = 0;
    titleEl.innerHTML = ''; // use innerHTML to allow tags later if needed
    
    // add emojis via span
    const preEmoji = document.createElement('span'); preEmoji.className='emoji-pop'; preEmoji.textContent='🎂 ';
    const postEmoji = document.createElement('span'); postEmoji.className='emoji-pop'; postEmoji.textContent=' 🎂';
    
    clearInterval(twTimer);
    
    let typedText = '';
    twTimer = setInterval(() => {
        typedText += text.charAt(i);
        titleEl.innerHTML = `<span class="emoji-pop">🎂</span> ${typedText}`;
        i++;
        if (i >= text.length) {
            clearInterval(twTimer);
            if (fireworksInterval) {
                clearInterval(fireworksInterval); // Stop typewriter fireworks
            }
            titleEl.innerHTML = `<span class="emoji-pop">🎂</span> ${text} <span class="emoji-pop">🎂</span>`;
            subEl.textContent = 'May your day be as beautiful as these flowers...';
            subEl.style.opacity = 1;
            setTimeout(() => {
                document.getElementById('scrollIndicator').classList.add('visible');
                document.body.classList.remove('locked'); // ALLOW SCROLLING
            }, 1000);
        } else {
            // Trigger a firework occasionally during typing
            if (Math.random() < 0.1) {
                const x = (Math.random() < 0.5 ? 0.2 : 0.8) * window.innerWidth;
                const y = (0.2 + Math.random() * 0.4) * window.innerHeight;
                createFirework(x, y);
            }
        }
    }, 100);
    
    // Also launch fireworks consistently while typing
    let fireworksInterval = setInterval(() => {
        if (i < text.length) {
            const x = (Math.random() < 0.5 ? 0.1 + Math.random() * 0.2 : 0.7 + Math.random() * 0.2) * window.innerWidth;
            const y = (0.1 + Math.random() * 0.4) * window.innerHeight;
            createFirework(x, y);
        }
    }, 500);
}

// ===== GALLERY POLAROID GENERATOR =====
function populateGallery() {
    const container = document.getElementById('polaroidContainer');
    if (!container) return;
    
    container.innerHTML = GALLERY.map((p, i) => {
        // slight random rotation for polaroids
        const rot = (Math.random() - 0.5) * 10;
        return `
        <div class="polaroid reveal delay-${i % 3}" style="--rot: ${rot}deg">
            <div class="polaroid-img" style="background: ${p.color}">
                <span class="emoji-pop">${p.emoji}</span>
            </div>
            <div class="polaroid-cap">${p.caption}</div>
        </div>
        `;
    }).join('');
}

// ===== INTERACTIVE CANDLE & FIREWORKS =====
const completedInteractions = { candle: false, flip: false, scratch: false, buildup: false };
let isScrollLocked = false;
let scrollLockTimer = null;

function unlockScroll(interactionId) {
    if (interactionId) completedInteractions[interactionId] = true;
    isScrollLocked = false;
}

// Block scroll events directly on mainContent and window
const mainContent = document.getElementById('mainContent');
if (mainContent) {
    mainContent.addEventListener('wheel', (e) => {
        if (isScrollLocked) e.preventDefault();
    }, { passive: false });
    
    mainContent.addEventListener('touchmove', (e) => {
        if (isScrollLocked) e.preventDefault();
    }, { passive: false });
}

window.addEventListener('keydown', (e) => {
    if (isScrollLocked && ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
    }
}, { passive: false });

let candleTaps = 0;
function blowCandle() {
    candleTaps++;
    const inst = document.getElementById('candleInst');
    if (candleTaps === 1) inst.innerHTML = 'One more time! <span class="emoji-pop">💨</span>';
    else if (candleTaps === 2) inst.innerHTML = 'One last breath! <span class="emoji-pop">🌬️</span>';
    else if (candleTaps >= 3) {
        document.getElementById('candleFlame').classList.add('out');
        inst.innerHTML = 'Yay! You did it! <span class="emoji-pop">👏</span>';
        document.getElementById('candleWrapper').style.pointerEvents = 'none';
        
        // Unlock scroll
        unlockScroll('candle');
        
        // Show gifts and fireworks
        setTimeout(() => {
            document.getElementById('giftContainer').classList.remove('hidden');
            startFireworks();
        }, 500);
    }
}

function startFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2, y: canvas.height / 2 + 100,
            vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 1) * 20,
            c: `hsl(${Math.random()*360}, 100%, 60%)`,
            life: 1, lifeDrop: 0.01 + Math.random() * 0.02
        });
    }
    
    function render() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
            if (p.life > 0) {
                alive = true;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.5; // gravity
                p.life -= p.lifeDrop;
            }
        });
        if (alive) requestAnimationFrame(render);
        else canvas.classList.add('hidden');
    }
    render();
}

// ===== MEMORY FLIP CARDS =====
let flippedCount = 0;
function flipCard(el) {
    if (el.classList.contains('flipped')) return;
    el.classList.add('flipped');
    flippedCount++;
    if (flippedCount >= 3) {
        unlockScroll('flip');
    }
}

// ===== SCRATCH CARD =====
function initScratch() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.parentElement.clientWidth;
    const ch = canvas.parentElement.clientHeight;
    canvas.width = cw; canvas.height = ch;

    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(0, 0, cw, ch);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#dcdcdc';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here', cw/2, ch/2);

    let isDrawing = false;
    let scratchProgress = 0;
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI*2);
        ctx.fill();
        scratchProgress++;
        if (scratchProgress > 5 && !completedInteractions['scratch']) {
            unlockScroll('scratch');
        }
    }

    const startDraw = (e) => { isDrawing = true; scratch(e.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left, e.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top); };
    const endDraw = () => isDrawing = false;
    const draw = (e) => {
        if (!isDrawing) return;
        scratch(e.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left, e.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top);
    };

    canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('mouseup', endDraw); canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('mousemove', draw); canvas.addEventListener('touchmove', draw);
}

// ===== BUILDUP TYPEWRITER =====
let buildupStarted = false;

function startBuildup() {
    // Hide the trigger, show the text element
    document.getElementById('buildupTriggerContainer').style.display = 'none';
    const el = document.getElementById('buildupText');
    el.style.display = 'block';
    typewriteBuildup();
}

function typewriteBuildup() {
    if (buildupStarted) return;
    buildupStarted = true;
    const el = document.getElementById('buildupText');
    const text = "Out of all the beautiful things in this world...\n\nthe one I am most incredibly grateful for...\n\nis knowing you.";
    let i = 0;
    el.innerHTML = '';
    const baseSpeed = 70;
    
    function typeWriter() {
        if (i < text.length) {
            let char = text.charAt(i);
            el.innerHTML += char === '\n' ? '<br>' : char;
            i++;
            
            let currentSpeed = baseSpeed;
            if (char === '.') {
                currentSpeed = 400;
            } else if (char === '\n') {
                currentSpeed = 800;
            }
            
            setTimeout(typeWriter, currentSpeed);
        } else {
            setTimeout(() => {
                document.getElementById('postBuildupContent').style.display = 'block';
                completedInteractions['buildup'] = true;
            }, 500);
        }
    }
    typeWriter();
}

// ===== INTERSECTION OBSERVER (Scroll Animations) =====
function initObserver() {
    let scrollLockTimer = null;
    const mainContent = document.getElementById('mainContent');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('active')) {
                entry.target.classList.add('active');
                
                const section = entry.target.closest('section');
                
                if (section && !section.classList.contains('has-been-locked')) {
                    section.classList.add('has-been-locked');
                    
                    // Allow normal scrolling for sections with data-no-lock
                    if (section.getAttribute('data-no-lock') === 'true') {
                        return; // Do not apply any lock or scrollIntoView
                    }
                    
                    const requireId = section.getAttribute('data-require');
                    if (requireId && !completedInteractions[requireId]) {
                        // Lock permanently until the interaction is completed
                        isScrollLocked = true;
                        if (scrollLockTimer) clearTimeout(scrollLockTimer);
                        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Temp lock scroll for 2 seconds when a normal section is revealed
                        const lockDuration = 2000;
                        
                        isScrollLocked = true;
                        if (scrollLockTimer) clearTimeout(scrollLockTimer);
                        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        scrollLockTimer = setTimeout(() => {
                            if (isScrollLocked) unlockScroll(null);
                        }, lockDuration);
                    }
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== START EXPERIENCE =====
function startExperience() {
    document.getElementById('landingOverlay').classList.add('fade-out');
    document.getElementById('mainContent').classList.remove('hidden');
    
    createFlowers();
    setTimeout(typewriterBirthday, 500);
    populateGallery();
    setTimeout(initScratch, 500); // delay to ensure layout is ready
    initObserver();

    // Start music
    if (ytPlayer && ytReady) {
        ytPlayer.playVideo();
        document.getElementById('miniPlayer').classList.add('show');
    }
}

// ===== MUSIC PLAYER (YOUTUBE API) =====
let ytPlayer;
let ytReady = false;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('ytApiPlayer', {
        host: 'https://www.youtube-nocookie.com',
        height: '10', width: '10',
        videoId: 'Ex7xvJV9xFc', // The 1975 - About You (Lyrics)
        playerVars: { 
            'autoplay': 0, 
            'controls': 0, 
            'loop': 1, 
            'playlist': 'Ex7xvJV9xFc'
        },
        events: {
            'onReady': () => { ytReady = true; ytPlayer.setVolume(70); },
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    const icon = document.getElementById('miniPlayerIcon');
    const btn = document.getElementById('miniPlayPause');
    if (event.data === YT.PlayerState.PLAYING) {
        icon.classList.remove('paused');
        btn.textContent = '⏸';
    } else {
        icon.classList.add('paused');
        btn.textContent = '▶';
    }
}

function toggleMusic() {
    if (!ytPlayer || !ytReady) return;
    if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
}

function changeVolume(val) {
    if (ytPlayer && ytReady) ytPlayer.setVolume(val);
}

// ===== CURSOR TRAIL =====
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.1) return;
    const heart = document.createElement('div');
    heart.className = 'trail-heart';
    heart.textContent = '🌸';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.getElementById('cursorTrail').appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
});
