//Set up PixiJS App
const stageW = 1280;
const stageH = 720;
const app = new PIXI.Application({width: stageW, height: stageH, backgroundColor: 0x121212, antialias: true});
document.body.appendChild(app.view);
//setup Ticker with "game loop"
app.ticker.FPS = 60;

// Score Tallies
let playerTally = 0;
let opponentTally = 0;

//SETUP STAGE
//ball
let ball = new PIXI.Graphics();
ball.beginFill(0xffffff);
ball.drawRect(-10, -10, 20, 20);
ball.x = 740;
ball.y = 360;
app.stage.addChild(ball);

// player paddle
let player = new PIXI.Graphics();
player.beginFill(0xffffff);
player.drawRect(-10, -100, 10, 100);
player.x = 40;
player.y = 360;
app.stage.addChild(player);

// opponent paddle 
let opponent = new PIXI.Graphics();
opponent.beginFill(0xffffff);
opponent.drawRect(-10, -100, 10, 100);
opponent.x = 1240;
opponent.y = 360;
app.stage.addChild(opponent);

// SCORE TEXT
// player score 
let playerScore = new PIXI.Text(playerTally, { 
     fontFamily: 'SilkScreen', 
     renderMode: 'bitmap',
     fontSize: 75, 
     fill: 0xbbbbbb
});
playerScore.x = stageW/2 - 120;
playerScore.y = 50;
app.stage.addChild(playerScore);

// score separator 
let Divide = new PIXI.Text('|', { 
     fontFamily: 'SilkScreen', 
     fontSize: 75, 
     renderMode: 'bitmap',
     fill: 0xbbbbbb
});

Divide.x = stageW/2;
Divide.y = 45;
app.stage.addChild(Divide);

// opponnt score 
let opponentScore = new PIXI.Text(opponentTally, { 
     fontFamily: 'SilkScreen', 
     renderMode: 'bitmap',
     fontSize: 75, 
     fill: 0xbbbbbb
});
opponentScore.x = stageW/2 + 90;
opponentScore.y = 50;
app.stage.addChild(opponentScore);

//MOTION PARAMETERS
let xv = randomInteger(-5, -5);
let yv = randomInteger(-5, 5);

// mouse tracker
let bg = new PIXI.Graphics();
bg.beginFill(0x121212);
bg.drawRect(0, 0, stageW, stageH);
app.stage.addChildAt(bg, 0);

app.stage.interactive = true;

let pointerY = stageH/2;

app.stage.addEventListener('pointermove', onPointerMove);

// MENU
function menuSetup() {
     // menu background
     let menuBack = new PIXI.Graphics();
     menuBack.beginFill(0x000000);
     menuBack.drawRect(0, 0, stageW, stageH);
     app.stage.addChildAt(menuBack, 7);

     // Title 
     let Title = new PIXI.Text("PONG", { 
          fontFamily: 'Silkscreen',
          renderMode: 'bitmap', 
          fontSize: 100, 
          fill: 0xbbbbbb
     });
     Title.x = stageW/3 + 60;
     Title.y = 70;

     app.stage.addChild(Title);

     // How to Play 
     let how = new PIXI.Text("Use the mouse to move the paddle on the left. Earn 3 points first to win my assignment.", { 
          fontFamily: 'Silkscreen',
          renderMode: 'bitmap', 
          wordWrap: 'true',
          wordWrapWidth: 800,
          fontSize: 25, 
          fill: 0xbbbbbb
     });
     how.x = stageW/6 + 90;
     how.y = 320;

     app.stage.addChild(how);

     startBtn = new PIXI.Container();
     let start = new PIXI.Text("Start", { 
          fontFamily: 'Silkscreen',
          renderMode: 'bitmap', 
          fontSize: 50, 
          fill: 0xbbbbbb
     });

     start.x = stageW/3 + 120;
     start.y = 500;

     startBtn.addChild(start);
     app.stage.addChild(startBtn);

     startBtn.interactive = true;
     startBtn.addEventListener('pointerover', onStartBtnOver);
     startBtn.addEventListener('pointerout', onStartBtnOut);
     startBtn.addEventListener('pointerdown', onStartBtnDown);

     //EVENT HANDLER FUNCTIONS for Start
     function onStartBtnOver(){
          gsap.to(start, {pixi: {alpha: .8}, duration: .1, ease: "back.out(2)"});
     }
     function onStartBtnOut(){
          gsap.to(start, {pixi: {alpha: 1}, duration: .1, ease: "back.in(2)"});
     }
     function onStartBtnDown(){
          //remove other event listeners
          startBtn.removeEventListener('pointerover', onStartBtnOver);
          startBtn.removeEventListener('pointerout', onStartBtnOut);
          gsap.to(startBtn, {pixi: {alpha: 0}, duration: .1, ease: "back.in(2)", onComplete: gameStart});
     }

     function gameStart() {

          console.log("start");
          gsap.to(menuBack, {pixi:{alpha: 0}, duration: .1, ease: "easeOut"} );
          gsap.to(Title, {pixi:{alpha: 0}, duration: .1, ease: "easeOut"} );
          gsap.to(how, {pixi:{alpha: 0}, duration: .1, ease: "easeOut"} );
          gsap.to(startBtn, {pixi:{alpha: 0}, duration: .1, ease: "easeOut"} );
          
          runGame();
     }
}

menuSetup();

//----------------------------------------------------------------



function runGame(){
     app.ticker.add(onTick);
}

function download() {
     window.open("https://confederationconca-my.sharepoint.com/:w:/g/personal/mshield2_confederationcollege_ca/EeA3TH6u_BBMuvEU7ZEtTc4Bg1jOFCgBMRf7334Ipj7obQ?e=ISal7U", "googleTab");
}

function restart() {
     location.reload()
}

// GAME
// Player movement 
function onPointerMove(eventObj){
     pointerPosition = eventObj.data.global;
     //console.log("Pointer/mouse movement at: " + pointerPosition);
     //update pointer/mouse position vars
     pointerY = pointerPosition.y;
}

//TICKER LOOP
function onTick(){
     ball.rotation += toRadians(1);
     //apply velocity
     ball.x += xv;
     ball.y += yv;
     //set motion limits
     if (ball.x < 0) {
          opponentTally++;
          // console.log(opponentTally);
          destroyObj(opponentScore);

          opponentScore = new PIXI.Text(opponentTally, { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 75, 
               fill: 0xbbbbbb
          });
          opponentScore.x = stageW/2 + 100;
          opponentScore.y = 50;

          app.stage.addChild(opponentScore);
     }
     if (ball.x > 1280) {
          playerTally++;
          // console.log(playerTally);
          destroyObj(playerScore);

          playerScore = new PIXI.Text(playerTally, { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               align: "right",
               fontSize: 75, 
               fill: 0xbbbbbb
          });
          playerScore.x = stageW/2 - 100;
          playerScore.y = 50;

          app.stage.addChild(playerScore);
     }
     if (ball.x < 0 || ball.x > 1280){
          ball.x = stageW/2;
          ball.y = stageH/2;
          
          xv = 0;
          yv = 0;
          
          setTimeout( () => {
          
          xv = randomInteger(-5, 5);
          yv = randomInteger(-5, 5);

          console.log("xv is " + xv);
          console.log("yv is " + yv);
          console.log("");

          }, 1000);

          setTimeout( () => {
               if (xv == 0) {
               xv -= 3;
               console.log("xv is now " + xv);
               console.log("");
               }
               if (yv == 0) {
                    yv += 3;
                    console.log("yv is now " + yv);
                    console.log("");
               }
          }, 1000);
     }
     
     
     if (ball.y < 0 || ball.y > 720){
          yv *= -1;
     }

     // opponent movement
     opponent.y += (ball.y - opponent.y) / 35;

     // player movement
     player.y += (pointerY - player.y) / 5 ;

     if(boundsIntersect(ball, player)){
          // bounces ball back by flipping velocity

          console.log("xv is " + xv);
          console.log("yv is " + yv);
          console.log("");

          xv *= -1;
          yv *= -1;
          xv += randomInteger(-2, 2)
          yv += randomInteger(-2, 2)

          console.log("xv is " + xv);
          console.log("yv is " + yv);
          console.log("");

     }
     if(boundsIntersect(ball, opponent)){
          // bounces ball back
          // bounces ball back by flipping velocity
          console.log("xv is " + xv);
          console.log("yv is " + yv);
          console.log("");

          xv *= -1;
          yv *= -1;
          xv += randomInteger(-2, 2);
          yv += randomInteger(-2, 2);

          console.log("xv is " + xv);
          console.log("yv is " + yv);
          console.log("");
          
          
     }

     if (playerTally == 3) {
          xv *= 0;
          yv *= 0;

          let winCon = new PIXI.Container();
          winCon.x = stageW/2 - 200;
          winCon.y = stageH/2 - 100;
          app.stage.addChild(winCon);

          winTitle = new PIXI.Text("YOU WIN", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 75, 
               fill: 0xbbbbbb
          });

          winTitle.y -= 90;

          winCon.addChild(winTitle);

          winText = new PIXI.Text("Click to download assignment", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 30, 
               fill: 0xbbbbbb
          });

          winText.x -= 110;
          winText.y += 90;

          winCon.addChild(winText);

          winDownload = new PIXI.Text("DOWNLOAD", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 40, 
               fill: 0xbbbbbb
          });

          winDownload.y += 200;
          winDownload.x += 60;

          winCon.addChild(winDownload);

          winDownload.interactive = true;
          winDownload.addEventListener('pointerover', onDwnBtnOver);
          winDownload.addEventListener('pointerout', onDwnBtnOut);
          winDownload.addEventListener('pointerdown', onDwnBtnDown);

          //EVENT HANDLER FUNCTIONS For Download
          function onDwnBtnOver(){
               gsap.to(winDownload, {pixi: {alpha: .8}, duration: .1, ease: "back.out(2)"});
          }
          function onDwnBtnOut(){
               gsap.to(winDownload, {pixi: {alpha: 1}, duration: .1, ease: "back.in(2)"});
          }
          function onDwnBtnDown(){
               //remove other event listeners
               winDownload.removeEventListener('pointerover', onDwnBtnOver);
               winDownload.removeEventListener('pointerout', onDwnBtnOut);
               gsap.to(winDownload, {pixi: {alpha: 0}, duration: .1, ease: "back.in(2)", onComplete: download});
          }
     }
     if (opponentTally == 3) {
          xv *= 0;
          yv *= 0;

          let loseCon = new PIXI.Container();
          loseCon.x = stageW/2 - 190;
          loseCon.y = stageH/2 - 70;
          app.stage.addChild(loseCon);

          loseTitle = new PIXI.Text("YOU LOSE", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 75, 
               fill: 0xbbbbbb
          });

          loseTitle.y -= 90;

          loseCon.addChild(loseTitle);

          loseText = new PIXI.Text("Click to restart", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 30, 
               fill: 0xbbbbbb
          });

          loseText.x += 30;
          loseText.y += 90;

          loseCon.addChild(loseText);

          loseRestart = new PIXI.Text("RESTART", { 
               fontFamily: 'Silkscreen', 
               renderMode: 'bitmap',
               fontSize: 40, 
               fill: 0xbbbbbb
          });

          loseRestart.y += 200;
          loseRestart.x += 100;

          loseCon.addChild(loseRestart);

          loseRestart.interactive = true;
          loseRestart.addEventListener('pointerover', onDwnBtnOver);
          loseRestart.addEventListener('pointerout', onDwnBtnOut);
          loseRestart.addEventListener('pointerdown', onDwnBtnDown);

          //EVENT HANDLER FUNCTIONS For Download
          function onDwnBtnOver(){
               gsap.to(loseRestart, {pixi: {alpha: .8}, duration: .1, ease: "back.out(2)"});
          }
          function onDwnBtnOut(){
               gsap.to(loseRestart, {pixi: {alpha: 1}, duration: .1, ease: "back.in(2)"});
          }
          function onDwnBtnDown(){
               //remove other event listeners
               loseRestart.removeEventListener('pointerover', onDwnBtnOver);
               loseRestart.removeEventListener('pointerout', onDwnBtnOut);
               gsap.to(loseRestart, {pixi: {alpha: 0}, duration: .1, ease: "back.in(2)", onComplete: restart});
          }
          
     }
}

     

//converts degrees to radians by Nathan Clark. Borrowed from: https://natclark.com/tutorials/javascript-degrees-to-radians/

//optional precision arg determines number of decimals
function toRadians(degrees, precision = 2) {
     let radians = parseFloat(((parseFloat(degrees) * Math.PI) / 180).toFixed(precision)); 
     // console.log(degrees + " degrees converted to " + radians + " radians.");
     return radians;
};

function randomInteger(min, max) {
     //return a random int between min and max
     return Math.floor(Math.random() * (max - min + 1)) + min;
}
   
//check bounding box intersection for basic collision detection (returns true if overlap)
//explained well by Dower Chin tutoral at https://www.youtube.com/watch?v=-q_Zk5uxk7Q
function boundsIntersect(a, b){
     let ab = a.getBounds();
     let bb = b.getBounds();
     return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

//pass a reference for an object to remove it from memory
function destroyObj(obj){
     //console.log("destroying obj..." );
     //destroy dot for good housekeeping
     obj.destroy(true);
 }