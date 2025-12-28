// --- Configuration ---
const COUNTDOWN_START = 3;
const COUNTDOWN_SPEED = 1000; // ms per number
const SHOW_CARD_DELAY = 5000; // ms after title appears

// --- Elements ---
const countdownEl = document.getElementById('countdown');
const openingScene = document.getElementById('opening-scene');
const letterScene = document.getElementById('letter-scene');
const greetingCard = document.getElementById('greeting-card');
const mainTitle = document.getElementById('main-title');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const photoContainer = document.getElementById('photo-container');

// --- Custom Photos Configuration ---
// REPLACE these URLs with your own image paths (e.g., 'images/me.jpg')
const MY_PHOTOS = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
    'https://picsum.photos/200/200?random=6',
    'https://picsum.photos/200/200?random=7',
    'https://picsum.photos/200/200?random=8'
];

const PHOTO_COUNT = MY_PHOTOS.length; // Number of photos depends on the list above

// --- Fireworks Logic ---
let particles = [];
let fireworks = [];
let w, h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function random(min, max) { return Math.random() * (max - min) + min; }

class Firework {
    constructor(targetX, targetY) {
        this.x = w / 2;
        this.y = h;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 2;
        this.angle = Math.atan2(targetY - h, targetX - (w / 2));
        this.vx = Math.cos(this.angle) * 5;
        this.vy = Math.sin(this.angle) * 5;
        this.alpha = 1;
        this.dead = false;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y <= this.targetY) {
            this.dead = true;
            createParticles(this.x, this.y);
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(2, 5); // Explosive speed
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.friction = 0.95;
        this.gravity = 0.1;
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
        this.color = color;
        this.dead = false;
    }
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha <= 0) this.dead = true;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y) {
    const colors = ['#FFD700', '#FF4136', '#0074D9', '#00FFFF', '#FF00FF'];
    const count = 50;
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(random(0, colors.length))];
        particles.push(new Particle(x, y, color));
    }
}

function animateFireworks() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trail effect that fades out
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.dead) fireworks.splice(index, 1);
    });

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.dead) particles.splice(index, 1);
    });

    requestAnimationFrame(animateFireworks);
}

function launchRandomFirework() {
    const targetX = random(w * 0.1, w * 0.9);
    const targetY = random(h * 0.1, h * 0.5);
    fireworks.push(new Firework(targetX, targetY));
}

function spawnPhotos() {
    for(let i=0; i<PHOTO_COUNT; i++) {
        setTimeout(() => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'floating-photo';
            
            // Randomize position area (avoiding direct center where title is)
            let topPos = random(10, 70);
            let leftPos = random(5, 90);
            
            // Simple logic to push away from center Title area (approx 30-70% height, 20-80% width)
            if (topPos > 30 && topPos < 70 && leftPos > 20 && leftPos < 80) {
                 if(Math.random() > 0.5) topPos = random(10, 30); // Move up
                 else topPos = random(70, 85); // Move down
            }

            const rotation = random(-15, 15); // deg
            
            photoDiv.style.top = `${topPos}%`;
            photoDiv.style.left = `${leftPos}%`;
            photoDiv.style.setProperty('--rotation', `${rotation}deg`);
            
            // Content
            // Use image from the MY_PHOTOS array
            const imgUrl = MY_PHOTOS[i];
            
            photoDiv.innerHTML = `
                <div class="photo-inner">
                    <img src="${imgUrl}" alt="Memory ${i+1}">
                </div>
            `;
            
            photoContainer.appendChild(photoDiv);
        }, i * 300); // Fast popping interval
    }
}

// --- Sequence Logic ---
async function playSequence() {
    animateFireworks(); // Start rendering loop

    // 1. Countdown
    for (let i = COUNTDOWN_START; i > 0; i--) {
        countdownEl.innerText = i;
        countdownEl.className = ''; 
        void countdownEl.offsetWidth; // trigger reflow
        countdownEl.className = 'count-animate';
        await new Promise(r => setTimeout(r, COUNTDOWN_SPEED));
    }
    
    // Clear countdown
    countdownEl.style.display = 'none';

    // 2. Main Title & Fireworks
    mainTitle.classList.add('title-reveal');
    
    // Spawn Photos
    spawnPhotos();
    
    // Launch an initial burst of fireworks
    for(let i=0; i<5; i++) {
        setTimeout(launchRandomFirework, i * 300);
    }
    // Continue launching fireworks randomly
    const fwInterval = setInterval(() => {
        if(openingScene.style.opacity === '0') clearInterval(fwInterval);
        else launchRandomFirework();
    }, 800);

    // 3. Transition to Letter
    setTimeout(() => {
        // Fade out opening scene
        openingScene.style.opacity = '0';
        openingScene.style.pointerEvents = 'none';
        
        // Show letter scene
        letterScene.style.opacity = '1';
        letterScene.style.pointerEvents = 'auto';
        
        // Animate card entry
        setTimeout(() => {
            greetingCard.classList.add('show-card');
            
            // Allow time for envelope to appear, then open it
            setTimeout(() => {
                document.querySelector('.envelope').classList.add('open');
            }, 1000);
            
        }, 500);

    }, SHOW_CARD_DELAY);
}

// Start
window.onload = playSequence;
