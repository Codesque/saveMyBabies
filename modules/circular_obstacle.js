export class CircularObstacle{

    static num_of_obs = 0;
    static obstacleArr = [];
    static overlapping = false;
    static EnemyType = {

        0: 'FLOWEY1',
        1: 'FLOWEY2',
        2: 'FLOWEY3',
        3: 'LEMONTREE1',
        4: 'BUSH1',
        5: 'BUSH2',
        6: 'BUSH3',
        7: 'LEMONTREE2',
        8: 'BUSH4',
        9: 'BUSH5',
        10: 'BUSH6',
        11: 'LEMONTREE3'


    };

    constructor(game, col_x, col_y, col_rad ) {
        this.col_x = col_x; 
        this.col_y = col_y; 
        this.col_rad = col_rad;
        this.startDeg = 0; 
        this.endDeg = Math.PI * 2;

        this.image = document.getElementById('obstacleSprite');

        // 250 = width of the png / number of columns
        // 250 = height of the png / number of rows
        this.spriteW = 250; 
        this.spriteH = 250; 
        
        // to adjust the image size use copies of the size values 
        this.w = this.spriteW * 0.5; 
        this.h = this.spriteH * 0.5;

        // to adjust the location of the spritesheet depend on the collider
        this.spriteX = this.col_x - this.w * 0.5; 
        this.spriteY = this.col_y - this.h * 0.5 - 50;
        const enemyNo = Math.floor(Math.random() * 12);
        this.frameX = Math.floor(enemyNo / 4); 
        this.frameY = ((enemyNo % 4));
        this.EnemyType = CircularObstacle.EnemyType[enemyNo];
        

        CircularObstacle.num_of_obs += 1;
        CircularObstacle.obstacleArr.push(this); 
    }

    static simulateObsCord(numOf, screenW, screenH) { 
        let output = []; 
        output.push([]);
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
            this.frameY * this.spriteW, this.frameX * this.spriteH, this.spriteW, this.spriteH,
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

            }
            
        

        
    }

    static clean() {
        CircularObstacle.obstacleArr.forEach(element => {
            element = null;
        });
    }

    update() {
        
    }



}