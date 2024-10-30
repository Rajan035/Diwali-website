document.getElementById("surpriseButton").addEventListener("click", function() {
    const message = document.getElementById("surpriseMessage");
    message.classList.toggle("hidden");
});

// Fireworks animation
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let fireworks = [];
const gravity = 0.05;

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.bursts = [];
        this.speedY = -8 - Math.random() * 3; // Increased initial speed
        this.speedX = Math.random() * 2 - 1;
        this.burstHeight = canvas.height * 0.2 + Math.random() * (canvas.height * 0.4); // Adjust burst height
    }

    update() {
        if (!this.exploded) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += gravity;
            
            // Allow bursting if it reaches the calculated burst height or if it exceeds the top of the canvas
            if (this.y < this.burstHeight || this.y < 0) { 
                this.exploded = true;
                for (let i = 0; i < 80; i++) {
                    this.bursts.push(new Burst(this.x, this.y));
                }
            }
        } else {
            this.bursts.forEach(burst => burst.update());
            this.bursts = this.bursts.filter(burst => burst.alpha > 0);
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.bursts.forEach(burst => burst.draw());
        }
    }
}

class Burst {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, `;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function addFirework() {
    const firework = new Firework(Math.random() * canvas.width, canvas.height);
    fireworks.push(firework);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && firework.bursts.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

setInterval(addFirework, 500);
animate();