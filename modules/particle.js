let particleArr = [];

class Particle{

    constructor(game, x, y, color) {
        this.game = game; 
        this.col_x = x; 
        this.col_y = y; 
        this.radius = 5 + 5 * Math.random();
        this.color = color; 

        this.speedX = Math.random() * 6 - 3; 
        this.speedY = Math.random() * 2 + 0.5; 

        this.angle = 0; 
        this.va = Math.random() * 0.1 + 0.05; 
        this.isKill = false;

        particleArr.push(this);
    }

    draw(context) {
        context.save(); 
        context.fillStyle = this.color; 
        context.strokeStyle = 'black'; 

        context.beginPath(); 
        context.arc(this.col_x, this.col_y, this.radius, 0, Math.PI * 2); 
        context.fill(); 
        context.stroke(); 
        context.restore(); 
        

    }



} 

class FireFly extends Particle{

    check4_gameBoundaries() {
        if (this.col_y < this.radius) this.isKill = true;
    }

    update() {
        this.col_x += Math.cos(this.angle) *this.speedX; 
        this.col_y -= this.speedY;
        this.angle += this.va;
        this.check4_gameBoundaries();
    }

}

class Spark extends Particle{

    shrinkParticle() {
        // Watch out to the fact that if you shrink a lot , game crashes
        if (this.radius > 0.1) this.radius -= 0.05; 
        if (this.radius < 0.2) this.isKill = true;
    }

    update() {
        this.angle += this.va * 0.5;
        this.col_x -= Math.cos(this.angle) *this.speedX; 
        this.col_y -= Math.sin(this.angle) * this.speedY;
        this.shrinkParticle();
        
    }

}


function particleCleaner() {
    particleArr = particleArr.filter(obj => !obj.isKill);
}

export { Particle ,FireFly, Spark, particleArr , particleCleaner };