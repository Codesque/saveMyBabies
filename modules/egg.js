import { genericColl } from "./collusions.js";
import { Larva } from "./larva.js";

class Egg{

    static numOf_eggs = 0; 
    static eggArr = [];
    constructor(game, col_x, col_y, col_rad) {
        this.game = game;
        this.col_x = col_x; 
        this.col_y = col_y; 
        this.col_rad = col_rad; 
        this.startDeg = 0; 
        this.endDeg = Math.PI * 2;

        
        this.image = document.getElementById('eggSprite'); 
        this.spriteW = 110; 
        this.spriteH = 135;
        
        this.w = this.spriteW * 0.5; 
        this.h = this.spriteH * 0.5; 
        
        this.spriteX = this.col_x - 0.5 * this.w; 
        this.spriteY = this.col_y - 0.5 * this.h;


        this.lifeTime = 5000 * Math.random();
        this.timer = 0;
        this.isKill = false;
        Egg.eggArr.push(this);
        Egg.numOf_eggs += 1;
    }


    static simulate_EggSpawn(numOf , screenW , screenH) {
        let output = []; 
        for (let i = 0; i < numOf; i++){
            let col_x = Math.random() * screenW;
            let col_y =(Math.random() * (screenH));
            let col_rad = 30;
            output.push([col_x, col_y, col_rad]);
        }
        return output;
        
    }

    draw(context = CanvasRenderingContext2D) {
        //context.strokeStyle = "red";
        // Single sprite drawImage : 
        //context.drawImage(this.image, this.spriteX, this.spriteY);
        
        // MultiSprite  drawImage :
        context.drawImage(
            this.image,
            0, 0, this.spriteW, this.spriteH,
            this.spriteX, this.spriteY,
            this.w , this.h 
            );
        
        
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
            context.restore() // start applying private drawings from here
            context.stroke();  

            const displayTimer = ((this.lifeTime - this.timer)* 0.001).toFixed(0);
            context.fillText(displayTimer, this.col_x, this.col_y - 40);

            }
            
        

        
    }


    check4_coll(ObjectsThatCollides = []) { 
        
        ObjectsThatCollides.forEach(

            obj => {
                
                let [isColl, dx, dy, distance, sumOf_rad] = genericColl(this, obj);
                if (isColl) {
                    const unit_x = dx / distance; 
                    const unit_y = dy / distance; 

                    this.col_x = obj.col_x + (sumOf_rad + 1) * unit_x; 
                    this.col_y = obj.col_y + (sumOf_rad + 1) * unit_y;
                }


            }



        )
        
    }

    dragWithCollider() {
        this.spriteX = this.col_x - this.w * 0.5; 
        this.spriteY = this.col_y - this.h * 0.5;
    }

    check4_gameBoundaries() {

        // horizontal boundaries
        if (this.col_x < this.col_rad) this.col_x = this.col_rad;
        else if (this.col_x > this.game.w - this.col_rad) this.col_x = this.game.w - this.col_rad;

        // vertical boundaries 
        if (this.col_y < this.game.topMargin) this.col_y = this.game.topMargin;
        else if (this.col_y > this.game.h - this.col_rad) this.col_y = this.game.h - this.col_rad;
    }

    check4_lifespan() {
        if (this.timer > this.lifeTime) {
            Egg.numOf_eggs -= 1; 
            this.isKill = true;
            new Larva(this.game, this.col_x, this.col_y);

        }
    }


    update(collArr = []) {
        this.check4_coll(collArr);
        this.dragWithCollider();
        this.check4_gameBoundaries();

        this.timer += this.game.dT;
        this.check4_lifespan();
    }

}


function eggCleaner() {
    Egg.eggArr = Egg.eggArr.filter(obj => !obj.isKill);
}

export { Egg, eggCleaner };
