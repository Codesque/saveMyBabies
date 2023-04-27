import { genericColl } from "./collusions.js";
import { FireFly, Spark } from "./particle.js";
class Larva{

    static larvaArr = [];

    constructor(game , x0 = 100 , y0 = 100 ,r0 = 40, deg0= 0 , deg1 = (Math.PI * 2)) {
        this.game = game; 
        this.score = 0; 
        this.lostHatchlings = 0;
        this.col_x = x0; 
        this.col_y = y0; 
        this.col_rad = r0;
        this.startDeg = deg0; 
        this.endDeg = deg1;

        this.speedX = 0;
        this.speedY = -3 + Math.random() * -3; 
        this.k = 1; // speed constant
        this.image = document.getElementById('larvaSprite');

        this.spriteW = 150; 
        this.spriteH = 150; 
        
        this.w = this.spriteW * 0.5; 
        this.h = this.spriteH * 0.5;
        
        this.spriteX = this.col_x - this.w * 0.5; 
        this.spriteY = this.col_y - this.h * 0.5; 

        this.frame = 0;
        this.animationSpeed = 0.1; 
        this.isKill = false;

        Larva.larvaArr.push(this);

    }

    dragSpriteWithColl() {
        this.spriteX = this.col_x - this.w * 0.5; 
        this.spriteY = this.col_y - this.h * 0.5; 
        
    }

    animate(context = CanvasRenderingContext2D) { 
        
        this.frame %= 2;

        let currentState = (Math.floor(this.frame));
        let animationFrame = (currentState * this.spriteH);

        console.log(animationFrame);
        context.drawImage(
            this.image,
            0, animationFrame, this.spriteW, this.spriteH,
            this.spriteX, this.spriteY,
            this.w, this.h
        );
        this.frame += this.animationSpeed; 
        
        
        

        
    }

    draw(context = CanvasRenderingContext2D) {
        this.animate(context); 
        
        if (window.debug_mode) {
            
            context.beginPath(); 
            context.arc(
                this.col_x, this.col_y,
                this.col_rad,
                this.startDeg, this.endDeg
            ); 
            context.save() // start applying private drawings from here
            context.stroke();
            context.globalAlpha = 0.4;
            context.fill();
            context.restore(); // start applying private drawings from here
            context.stroke(); 

        }

    }

    movement() {
        this.col_x += this.speedX; 
        this.col_y += this.speedY;
        this.dragSpriteWithColl(); 
    } 

    check4_gameBoundaries() {
        if (this.col_y < this.game.topMargin) {
            this.isKill = true;
            this.game.score++; 
            let particleNum = 3 + Math.random() * 5;
            for (let i = 0; i < particleNum; i += 1)
            new FireFly(this.game, this.col_x, this.col_y, "yellow");
        }
            
    }

    check4_pushColl() {
        if (this.game) {
            let [isColl, dx, dy, distance, sumOf_rad] = genericColl(this, this.game.player); 
            if (isColl) {
    
                const unit_x = (dx / distance);
                const unit_y = (dy / distance);
    
                this.col_x = this.game.player.col_x + (sumOf_rad + 1) * unit_x ; 
                this.col_y = this.game.player.col_y + (sumOf_rad + 1) * unit_y; 
            }
            
        }
        





    }

    check4_loseColl() {
        
        if (this.game) {

            this.game.enemyGroup.forEach(

                enemy => {
                    
                    if ( genericColl(this, enemy)[0]) {
                
                        this.isKill = true; 
                        this.game.lostHatchlings++;
                        let particleNum = 3 + Math.random() * 5;
                        for (let i = 0; i < particleNum; i += 1)
                        new Spark(this.game, this.col_x, this.col_y, "red");
                          
                    }
                }


            );
            
        }


    }

    


    update() {
        this.movement(); 
        this.check4_gameBoundaries();
        this.check4_pushColl();
        this.check4_loseColl();

    }

}


function larvaCleaner() {
    Larva.larvaArr = Larva.larvaArr.filter(obj => !obj.isKill);
}

export { Larva , larvaCleaner };