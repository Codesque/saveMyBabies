import { CircularObstacle } from "./circular_obstacle.js";
import { genericColl } from "./collusions.js";
class Enemy{

    static EnemyType = {
        0: 'thorned',
        1: 'eyeOnHead', 
        2: 'curly',
        3: 'eyesOnEverywhere'
    }; 


    constructor(game ,r0 = 40, deg0= 0 , deg1 = (Math.PI * 2)) {
        this.game = game; 
        this.col_rad = r0;
        this.startDeg = deg0; 
        this.endDeg = deg1;
        this.determineSpawnPoint();
        this.speedY = 0; 
        

        this.image = document.getElementById('toadSprite'); // 1 frame = 140 x 260 
        this.spriteW = 140; 
        this.spriteH = 260; 
        this.w = this.spriteW * 0.5; 
        this.h = this.spriteH * 0.5;
        this.enemyType = Math.floor(Math.random() * 4);


        this.spriteX = this.col_x - (this.w * 0.5); 
        this.spriteY = this.col_y - (this.h * 0.5); 


    }
    determineSpawnPoint() {
        let additionalMargin = 50 + Math.random() * 100; 
        this.col_x = 1280 + additionalMargin;
        this.col_y = 260 + Math.random() * 430;
        this.speedX = 3 + Math.random() * 4;
    }


    draw(context = CanvasRenderingContext2D) {

        context.drawImage(
            this.image, 
            0, this.enemyType * 260, this.spriteW, this.spriteH, 
            this.spriteX, this.spriteY, 
            this.w , this.h 
        )

        if (window.debug_mode) {
            
            context.beginPath();
            context.arc(
                this.col_x, this.col_y, this.col_rad,
                this.startDeg, this.endDeg
            ); 
            context.save(); 
            context.stroke(); 
            context.globalAlpha = 0.5; 
            context.fill(); 
            context.restore(); 
            context.stroke();
        }
        
    }


    movement() {
        this.col_x -= this.speedX;  
        this.spriteX = this.col_x - (this.w * 0.5); 
        this.spriteY = this.col_y - (this.h * 0.5); 
    }

    check4_gameBoundaries() {
        
        if (this.col_x < this.col_rad) this.determineSpawnPoint();
    }

    check4_coll(collArr = []) {

        collArr.forEach(
            obstacle => {
                let [isColl, dx ,dy , distance, sumOf_rad] = genericColl(this, obstacle); 
                if (isColl) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;  
                    this.col_x = obstacle.col_x + (sumOf_rad + 5) * unit_x; 
                    this.col_y = obstacle.col_y + (sumOf_rad + 5) * unit_y;  
                }
            }

       )
    }


    update(collArr) {
        this.movement(); 
        this.check4_coll(collArr);

        if((this.game)&&(!this.game.gameOver))
        this.check4_gameBoundaries();
    }


}


function enemySpawner(game , numberOf) {

    let enemyArr = []; 
    for (let i = 0; i < numberOf; i += 1) enemyArr.push(
        new Enemy(game)
    ); 

    return enemyArr;
    
}

export { Enemy, enemySpawner }; 
