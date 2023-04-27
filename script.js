import { Player } from './modules/player.js';
import { Key } from './modules/key.js';
import { CircularObstacle } from './modules/circular_obstacle.js';
import { Egg , eggCleaner } from './modules/egg.js';
import { Enemy, enemySpawner } from './modules/enemy.js'; 
import { Larva, larvaCleaner } from './modules/larva.js';
import { Particle , FireFly , Spark , particleCleaner , particleArr } from './modules/particle.js';



window.addEventListener(
    'load',
    function () {
        
        const canvas = document.getElementById("canvas1"); 
        const context = canvas.getContext('2d');
        canvas.width = 1280;
        canvas.height = 720;
        var debug_mode = false;

        context.fillStyle = 'white';
        context.lineWidth = 3; 
        context.strokeStyle = 'white';
        context.font = "20px Helvetica";
        context.textAlign = "center";

        

        
        class Game {

            constructor(canvas) {
                this.canvas = canvas;
                this.w = this.canvas.width; 
                this.h = this.canvas.height;
                this.topMargin = 260;
                this.score = 0;
                this.lostHatchlings = 0;
                this.winningScore = 1;
                this.gameOver = false;
                
                // frame logic
                this.dT = 0;
                this.fps = 70; 
                this.timer = 0; 
                this.intervalInMilliseconds = 1000 / this.fps;

                //egg timer 
                this.eggTimer = 0;
                this.eggInterval = 500; 
                this.eggAmount = 1; 


                

                this.player = new Player(this, 600, 400); 
                this.enemyGroup = enemySpawner(this, 10);
                this.mouse = {
                    x: this.w * 0.5,
                    y: this.h * 0.5,
                    pressed: false
                }; 
                this.cropOffset4MousePosition(this.canvas);
                //this.keyboardControl(this.canvas);
                this.brute_force_sol2overlaying_cObs(10, 500);
            }

            initialise_circularObstacles(numOf) { 
                let arr = CircularObstacle.simulateObsCord(numOf, this.w, this.h);
                for (let i = 0; i < numOf; i++) new CircularObstacle(
                    this,
                    arr[i][0], 
                    arr[i][1], 
                    arr[i][2]
                );
            }

            brute_force_sol2overlaying_cObs(numOf, attempts) { 

                let attempt = 0; 
                let simArr = CircularObstacle.simulateObsCord(
                    attempts, this.w, this.h);
                
                //this.initialise_circularObstacles(1);
                
                while (
                    (CircularObstacle.obstacleArr.length < numOf) && 
                    (attempt < attempts)
                ) {
                    
                    
                    let testObstacle = simArr[attempt]; // [col_x , col_y , col_rad]
                    let additionalMargin = 40;

                    let overlap = false;
                    CircularObstacle.obstacleArr.forEach(
                        
                        
                        obstacle => {
                            let dx = testObstacle[0] - obstacle.col_x;
                            let dy = testObstacle[1] - obstacle.col_y;
                            //let distance = (( ((dx) ** (2)) + ((dy) ** (2)) ) ** (1/2));
                            let distance = Math.hypot(dy, dx);

                            let sumOf_r = testObstacle[2] + obstacle.col_rad;
                            let spawnerDistanceBuffer = 100;
                            

                            if (distance < (sumOf_r + spawnerDistanceBuffer)) {
                                overlap = true;
                            }
                        }
                    );
                    
                    let conditions = (
                        !overlap &&
                        (testObstacle[0] > 250) &&
                        ((testObstacle[0] + 250) < this.w) &&
                        (testObstacle[1] > 260) && 
                        (testObstacle[1] < this.h + additionalMargin )
                    );


                    if (conditions) {
                        new CircularObstacle(
                        this,
                        testObstacle[0],
                        testObstacle[1],
                            testObstacle[2]
                        );
                        
                    }
                        

                    attempt += 1;

                }
                
                
            }

            egg_spawn(numOf, attempts) {

                let attempt = 0; 
                let simArr = Egg.simulate_EggSpawn(attempts, this.w, this.h);
                
                
                while (
                    (Egg.numOf_eggs < numOf) && 
                    (attempt < attempts)
                ) {
                    
                    
                    let testObstacle = simArr[attempt]; // [col_x , col_y , col_rad]
                    let additionalMargin = 40;

                    let overlap = false;
                    Egg.eggArr.forEach(
                        
                        
                        egg => {
                            let dx = testObstacle[0] - egg.col_x;
                            let dy = testObstacle[1] - egg.col_y;
                            //let distance = (( ((dx) ** (2)) + ((dy) ** (2)) ) ** (1/2));
                            let distance = Math.hypot(dy, dx);

                            let sumOf_r = testObstacle[2] + egg.col_rad;
                            let spawnerDistanceBuffer = 30;
                            

                            if (distance < (sumOf_r + spawnerDistanceBuffer)) {
                                overlap = true;
                            }
                        }
                    );

                    CircularObstacle.obstacleArr.forEach(
                        
                        
                        obstacle => {
                            let dx = testObstacle[0] - obstacle.col_x;
                            let dy = testObstacle[1] - obstacle.col_y;
                            //let distance = (( ((dx) ** (2)) + ((dy) ** (2)) ) ** (1/2));
                            let distance = Math.hypot(dy, dx);

                            let sumOf_r = testObstacle[2] + obstacle.col_rad;
                            let spawnerDistanceBuffer = 20;
                            

                            if (distance < (sumOf_r + spawnerDistanceBuffer)) {
                                overlap = true;
                            }
                        }
                    );

                    const additional_top_margin = 100;
                    
                    let conditions = (
                        !overlap &&
                        (testObstacle[0] > 100) &&
                        ((testObstacle[0] + 100) < this.w) &&
                        (testObstacle[1] > 260 + additional_top_margin) && 
                        (testObstacle[1] < this.h + additionalMargin )
                    );


                    if (conditions) {
                        new Egg(
                        this,
                        testObstacle[0],
                        testObstacle[1],
                            testObstacle[2]
                        );
                        
                    }
                        

                    attempt += 1;

                }
                

            }

            egg_spawner() {
                if (this.eggTimer > this.eggInterval) {
                    this.egg_spawn(this.eggAmount, 500);
                    this.eggTimer = 0;
                } 
                else {
                    this.eggTimer += this.dT;
                }

                
            }

            render_eggs(context) {
                Egg.eggArr.forEach(
                    egg => egg.draw(context)
                );
            }

            render_cObs(context) {
                CircularObstacle.obstacleArr.forEach(
                    obstacle => {
                        obstacle.draw(context);
                    }
                )
            }

            render(context = CanvasRenderingContext2D) {


                if (this.timer > this.intervalInMilliseconds) {
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    this.player.draw(context);
                    this.render_cObs(context);
                    this.render_eggs(context);
                    this.player.update(this.mouse.x, this.mouse.y);
                    
                    this.timer = 0;

                    this.egg_spawner();
                }
                this.timer += this.dT; 


            } 


            display_score(context = CanvasRenderingContext2D) { 
                context.save(); 
                context.stroke();
                context.textAlign = "left"; 
                context.fillText("Score :" + this.score, 25, 50); 
                if(window.debug_mode) context.fillText("Lost Hatchlings :" + this.lostHatchlings, 25, 100); 
                context.restore();
                
            }


            check4_gameStatus(context) {

                if (this.score >= this.winningScore) {
                    this.gameOver = true;

                    context.save(); 
                    context.fillStyle = 'rgba(0,0,0,0.5)';
                    context.textAlign = 'center'; 
                    context.fillRect(0 , 0 , this.w , this.h)

                    context.fillStyle = 'white'; 
                    let message1; 
                    let message2;

                    // winning cond 
                    if (this.lostHatchlings <= 5) {
                        message1 = "Zorbaları Zorbaladın!"; 
                        message2 = "Güçlü kuşlar yalnız uçar derler. Tek başına hepsini hallettin. Helal Olsun!"; 
                    }
                    else {
                        message1 = "Her yer omlet kokuyor."; 
                        message2 = "Annem bile kahvaltılık yumurtalarını daha iyi korur. R ye basarak tekrar oyna ve kaybettiğin "
                            + this.lostHatchlings + " yumurtanın imtikamını al";
                    }

                    context.font = "80px Helvetica"; 
                    context.fillText(message1, 0.5 * this.w, 0.5 * this.h); 
                    context.font = "20px Helvetica"; 
                    context.fillText(message2, 0.50 * this.w, 0.65 * this.h); 

                    context.fillText('Final score :' + this.score, this.w * 0.5, this.h * 0.7);

                    context.restore();

                }

                
            }

            renderWith_YSORT(context) {
                if (this.timer > this.intervalInMilliseconds) {
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    let gameObjects =
                        [
                        ...CircularObstacle.obstacleArr,
                        ...Egg.eggArr,
                        this.player,
                        ...this.enemyGroup,
                        ...Larva.larvaArr, 
                        ...particleArr
                        
                        ]; 
                    gameObjects.sort((a, b) => {return  a.col_y - b.col_y } ); 
                    gameObjects.forEach(
                        obj => {
                            obj.draw(context); 
                            if (obj instanceof Player) obj.update(this.mouse.x, this.mouse.y);
                            else if ((obj instanceof Enemy))
                                obj.update([...CircularObstacle.obstacleArr, this.player]);
                            else if (obj instanceof Egg)
                                obj.update([...CircularObstacle.obstacleArr, this.player, ...this.enemyGroup]);    
                                
                            else obj.update(); 

                        }
                    );
                    this.timer = 0;

                    if(!this.gameOver)  this.egg_spawner();
                    eggCleaner();
                    larvaCleaner();
                    particleCleaner();

                    this.display_score(context);
                    this.check4_gameStatus(context);
                    
                }
                this.timer += this.dT; 
                

            }

            cropOffset4MousePosition(canvas) {
                
                canvas.addEventListener(
                    Key.MOUSE_DOWN,
                    e => {
                        this.mouse.x = e.offsetX;
                        this.mouse.y = e.offsetY;
                        console.log(this.mouse.x , this.mouse.y);
                        this.mouse.pressed = true;
                    }
                ); 

                canvas.addEventListener(
                    Key.MOUSE_UP,
                    e => {
                        this.mouse.x = e.offsetX;
                        this.mouse.y = e.offsetY;
                        this.mouse.pressed = false;
                    }
                ); 
                
                canvas.addEventListener(
                    Key.MOUSE_MOVE,
                    e => {

                        if (this.mouse.pressed) {
                            this.mouse.x = e.offsetX;
                            this.mouse.y = e.offsetY;
                        }

                    }
                ); 

                window.addEventListener(
                    Key.KEY_DOWN,
                    e => {

                        if(e.key == 'd')
                        window.debug_mode = !window.debug_mode;
                            

                    }
                ); 

                window.addEventListener(
                    Key.KEY_DOWN, 
                    e => {
                        if (e.key == 'r' && this.gameOver) this.restart();
                        
                    }

                );



            }

            
            restart() {

                
                CircularObstacle.obstacleArr = [];
                //particleArr = []; 
                //Egg.eggArr = []; 
                Larva.larvaArr = [];  
                this.player.col_x = 600; 
                this.player.col_y = 400; 


                
                this.enemyGroup = enemySpawner(this.game, 10);
                this.brute_force_sol2overlaying_cObs(10, 500);
                
                this.gameOver = false;
                this.score = 0; 
                this.lostHatchlings = 0;



            }


        } 


        const game = new Game(canvas);
        
        console.log(game); 



        let lastTimeStamp = 0;
        function animate(timeStamp) {

            game.dT = timeStamp - lastTimeStamp; 
            lastTimeStamp = timeStamp;
            
            

            
            //game.render(context);
            game.renderWith_YSORT(context);
            requestAnimationFrame(animate);
            
        }

        animate(0);









    }
     

    












)