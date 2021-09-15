//crear variables Trex
var trex, trex_running;
var trex_collided;
var restart, gameOver, restart_Image, gameOver_Image;
var jump_sound, checkpoint_sound, died_sound;

//crear variables suelo
var ground,groundImage;

var invisibleGround;

var salto;

var cloud, cloudImage;

var obstacles, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var rand;

var score;

var obstaclesGroup, cloudsGroup;

var PLAY =1;
var END =0;

var gameState = PLAY; 

//var mensaje = "Este es un mensaje de prueba";

function preload(){
 trex_running =  loadAnimation("trex1.png","trex3.png","trex4.png"); 
 trex_collided = loadAnimation("trex_collided.png");
 gameOver_Image = loadImage("gameOver.png");
  restart_Image= loadImage("restart.png");
  
 //subir imagen del suelo
 groundImage = loadImage("ground2.png");
  
  cloudImage= loadImage("cloud.png");
  
  obstacle1=loadImage("obstacle1.png");
  
  obstacle2=loadImage("obstacle2.png");
  
  obstacle3=loadImage("obstacle3.png");
  
  obstacle4=loadImage("obstacle4.png");
  
  obstacle5=loadImage("obstacle5.png");
  
  obstacle6=loadImage("obstacle6.png");
  
  jump_sound=loadSound("jump.mp3");
  
  checkpoint_sound=loadSound("checkPoint.mp3");
  
  died_sound=loadSound("die.mp3");
  
}

function setup(){
  //espacio del juego
  createCanvas(windowWidth,windowHeight);

  //Crear el Sprite del Trex
  trex = createSprite(50,height-10,20,50);
  trex.scale=0.5; 
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trex_collided);
  
  //crear el sprite del suelo
  ground=createSprite(width/2,height-20,600,20);
  ground.addImage("ground", groundImage);
  ground.x=ground.width/2;
  
  //crear un sprite de suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible=false;
  
  //var rand =Math.round(random(1,100));
  //console.log(rand);
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  score=0;
  
  trex.setCollider("circle",0,0,40);
  trex.debug=true;
  
  gameOver=createSprite(width/2,height/2);
  gameOver.addImage(gameOver_Image);

  
  restart=createSprite(width/2,height/2+50);
  restart.addImage(restart_Image);
  restart.scale=0.6;
  
   salto=0;
}

function draw(){
  background("white");
  
 
  
  text("score:"+score, width-100,20);
  
  //console.log(mensaje);
  
  if (gameState === PLAY){
    score=score+Math.round(getFrameRate()/60);
    //agregar el movimiento
  ground.velocityX=-(2+3*score/100);
    
    if(score%100===0&&score>0){
      checkpoint_sound.play();
    }

    if(ground.x<0){
    ground.x=ground.width/2;
     }
    //Salto
    if(trex.y<=height-50)salto=1;
    if(trex.y>=height-50) salto =0;
  
    if (touches.length>0||keyDown("space")&&(salto===0)){
      jump_sound.play();
      trex.velocityY=-10; 
      touches=[];
      }

    //le damos una velocidad de bajada "gravedad"
    trex.velocityY=trex.velocityY+0.5; 
    
    spawnClouds(); 
  
    spawnObstacles();
    
    gameOver.visible=false;
    restart.visible=false;
    
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      died_sound.play();
      //trex.velocityY=-12;
      //jump_sound.play();
    }
    
  }else if (gameState === END)
    {
      ground.velocityX=0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      trex.changeAnimation("collided", trex_collided);
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      trex.velocityY=0;
      gameOver.visible=true;
      restart.visible=true;
      
      if(touches.length>0 || mousePressedOver(restart)){
        reset();
        touches=[];
        }
      
    }
  
  
  //evita que el trex se caiga
  trex.collide(invisibleGround); 
  
  
 
  //console.log(frameCount);
  
  drawSprites();
 
}

function spawnClouds(){
  //escribir el código para aparecer las nubes
  if(frameCount % 60 === 0){
    cloud=createSprite(width,height-100,40,10);
    cloud.addImage(cloudImage);
    cloud.scale=0.5;
    cloud.y = Math.round(random(10,height-100));
    cloud.velocityX=-3;
    
    //console.log(trex.depth, cloud.depth);
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //asignar un tiempo de vida a las nubes
    //lifetime = Distancia / velocidad
    cloud.lifetime = width/-3;
    
    cloudsGroup.add(cloud);
  }
 
}

function spawnObstacles(){
  if(frameCount % 80 ===0){
    
    obstacle=createSprite(width,height-30,10,40);
    obstacle.velocityX=-(6+score/200);
    
    rand=Math.round(random(1,6));
    
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
        break;
        
        case 2:obstacle.addImage(obstacle2);
        break;
        
        case 3:obstacle.addImage(obstacle3);
        break;
        
        case 4:obstacle.addImage(obstacle4);
        break;
        
        case 5:obstacle.addImage(obstacle5);
        break;
        
        case 6:obstacle.addImage(obstacle6);
        break;
        
        default:
        break;
    
    }
    
    obstacle.scale=0.5;
    obstacle.lifetime=width/(obstacle.velocityX);
    
    obstaclesGroup.add(obstacle);
    
  }
}
  
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}