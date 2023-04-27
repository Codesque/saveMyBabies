import { genericColl } from "./collusions.js";
import { CircularObstacle } from "./circular_obstacle.js";
export class Player{
   

    

    constructor(game , x0 = 100 , y0 = 100 ,r0 = 40, deg0= 0 , deg1 = (Math.PI * 2)) {
        this.game = game; 
        this.col_x = x0; 
        this.col_y = y0; 
        this.col_rad = r0;
        this.startDeg = deg0; 
        this.endDeg = deg1;

        this.distance = 0;
        this.dx = 0; 
        this.dy = 0;

        this.speedX = 0;
        this.speedY = 0; 
        this.k = 5; // speed constant
        this.adjustSpriteData();

        
    }

    adjustSpriteData() {
        this.spriteSheet = document.getElementById('bullSprite');
        this.spriteW = 255; 
        this.spriteH = 255; 
        this.w = this.spriteW * 0.8 ; 
        this.h = this.spriteH * 0.8; 
        this.spriteX = this.col_x - (this.w * 0.5); 
        this.spriteY = this.col_y - (this.h * 0.5);

        this.animationState = 0;
        
    }

    movingAnimation(context = CanvasRenderingContext2D) {

        this.spriteX = this.col_x - (this.w * 0.5); 
        this.spriteY = this.col_y - (this.h * 1.1);
        let angle = Math.atan2(this.dy, this.dx); 
        
        if ((angle < -2.74) || (angle > 2.74)) this.animationState = 6; 
        else if (angle < -1.96) this.animationState = 7; 
        else if (angle < -1.17) this.animationState = 0;
        else if (angle < -0.39) this.animationState = 1; 
        else if (angle < 0.39) this.animationState = 2; 
        else if (angle < 1.17) this.animationState = 3;
        else if (angle < 1.96) this.animationState = 4; 
        else if (angle < 2.74) this.animationState = 5; 


        
        
        

            
        


        context.drawImage(
            this.spriteSheet,
            0 * this.spriteW, this.animationState * this.spriteH, this.spriteW, this.spriteH,
            this.spriteX, this.spriteY,
            this.w, this.h
        );
        
    }
    
    
    drawMovementLine(context = CanvasRenderingContext2D) {
        context.save();
        context.strokeStyle = 'yellow';
        context.beginPath(); 
        context.moveTo(this.col_x, this.col_y); 
        context.lineTo(this.game.mouse.x, this.game.mouse.y); 
        context.stroke(); 
        context.restore();    
    }

    draw(context = CanvasRenderingContext2D) {

        this.movingAnimation(context);

        
        
        //if (window.debug_mode) {
            
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
            this.drawMovementLine(context);

        //}



    }  

    movement(mouseX , mouseY) {
        
        this.dx = mouseX - this.col_x;
        this.dy = mouseY - this.col_y;
        
        const distance =
            (((mouseX - this.col_x) ** (2)) + ((mouseY - this.col_y) ** (2))) ** (1 / 2);
        
        
        
        this.speedX = (((this.dx) / distance)|| 0); 
        this.speedY = (((this.dy) / distance) || 0);
        
        if (distance > this.k) {
            this.col_x += ((this.speedX * this.k) || 0);
            this.col_y += ((this.speedY * this.k) || 0);
            
        }
        else {
            this.speedX = 0; 
            this.speedY = 0;
        }
    }


    check4_cObsColl() {
        CircularObstacle.obstacleArr.forEach(
            obstacle => {
                let [isColl, dx ,dy , distance, sumOf_rad] = genericColl(this, obstacle); 
                if (isColl) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;  
                    this.col_x = obstacle.col_x + (sumOf_rad + 5) * unit_x; 
                    this.col_y = obstacle.col_y + (sumOf_rad + 5) * unit_y;  
                    this.speedX = 0; 
                    this.speedY = 0;
                }
            }

       )
    }

    check4_gameBoundaries() {

        // horizontal boundaries
        if (this.col_x < this.col_rad) this.col_x = this.col_rad;
        else if (this.col_x > this.game.w - this.col_rad) this.col_x = this.game.w - this.col_rad;

        // vertical boundaries 
        if (this.col_y < this.game.topMargin) this.col_y = this.game.topMargin;
        else if (this.col_y > this.game.h - this.col_rad) this.col_y = this.game.h - this.col_rad;
    }

    update(mouseX, mouseY) { 
        this.check4_cObsColl();
        this.movement(mouseX, mouseY); 
        this.check4_gameBoundaries();
        
    }


    

    

  

} 