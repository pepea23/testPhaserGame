let player;
let cursors;
let currentSpeed;
let reticle;
let x;
let y;
let hight;
let width;
let bombs;
let bomb;
let text;
let score = 0;
let topScore =0;
let playerBullets;
let angle = 90;


class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        //,{ frameWidth: 100, frameHeight: 40 }, 0
        this.load.image('player','../../images/Spear.png');
        this.load.image('bullet','../../images/Stone weapon.png');
        this.load.image('target','../../images/Icon Alive.png');
        
    }

    create() {

        text = this.add.text(500,10,'USE [W][A][D] OR [↑][←][→] TO MOVE',{fontsize:'24px',fill:'#FFFFFF'});
        text = this.add.text(550,30,'USE [SPACE] TO SHOOT',{fontsize:'24px',fill:'#FFFFFF'});
        score = this.add.text(20,10,'SCORE : 0',{fontsize:'24px',fill:'#FFFFFF'});
        topScore = this.add.text(1080,10,'TOP SCORE : 0',{fontsize:'24px',fill:'#FFFFFF'});

        player = this.physics.add.image(400,300,'player').setScale(0.2,0.2);
        player.setInteractive();
        player.body.collideWorldBounds = true;

        reticle = this.physics.add.image(0, 0, 'target');
        reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        reticle.x = player.x+100;
        reticle.y = player.y;

        cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            Initialize:
            function Bullet(scene){
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
                this.speed = 1;
                this.born = 0;
                this.direction = 0;
                this.xSpeed = 0;
                this.ySpeed = 0;
                this.setSize(12,12,true);
            },

            fire: function (shooter,target){

                this.setPosition(shooter.x, shooter.y); 
                this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));
                
                if (target.y >= this.y)
                {
                    this.xSpeed = this.speed*Math.sin(this.direction);
                    this.ySpeed = this.speed*Math.cos(this.direction);
                }
                else
                {
                    this.xSpeed = -this.speed*Math.sin(this.direction);
                    this.ySpeed = -this.speed*Math.cos(this.direction);
                }
        
                this.rotation = shooter.rotation; 
                this.born = 0; 
            },

            update: function (time, delta)
            {
                this.x += this.xSpeed * delta;
                this.y += this.ySpeed * delta;
                this.born += delta;
                if (this.born > 1800)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        });

        playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
    }

    update() {

        if(cursors.left.isDown||this.keyA.isDown){
            player.angle -= 4;
        }else if(cursors.right.isDown||this.keyD.isDown){
            player.angle += 4;
        }
        if(cursors.up.isDown||this.keyW.isDown){
            currentSpeed = 200;
        }else if(currentSpeed>0){
            currentSpeed -= 4;
        }
        if(currentSpeed>0){
             this.physics.velocityFromRotation(player.rotation,currentSpeed,player.body.velocity);
             reticle.x = player.x+100;
             reticle.y = player.y;
        }
        if(cursors.space.isDown){
            var bullet = playerBullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);
            
            if (bullet){
                
                bullet.fire(player,reticle);
    
            }
        }
    
    }

    
}

export default GameScene;
