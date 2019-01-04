import { Function } from "core-js";

let reticle
let Bullets
let player 
let cursors
let time = 0

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }
     

    preload() {
        this.load.image('bullet','../src/image/yae9.png');
        this.load.image('player','../src/image/player.png');
        this.load.image('monster','../src/image/monster.png');
        this.load.image('target','../src/image/diamond.png');
    }

    create() {
        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize:

            function Bullet(scene){
                Phaser.GameObjects.Image.call(this,scene,0,0,'yae9') //

                this.speed = 1;
                this.born = 0;
                this.direction = 0;
                this.xSpeed = 0;
                this.ySpeed = 0;
                this.setSize(0.01, 0.01, true);
            },

            fire: function(shooter,target){
                this.setPosition(shooter.x,shooter.y);
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

                this.rotation = player.rotation;
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
        })

        player = this.physics.add.image(100, 0, 'player').setScale(0.2,0.2);
        player.setInteractive();    
        player.body.collideWorldBounds = true;
        player.setDamping(true);
        player.setDrag(0.99);
        player.setMaxVelocity(200);

        reticle = this.physics.add.sprite(100, 0, 'target');
        reticle.setOrigin(1, 1).setDisplaySize(10, 10).setCollideWorldBounds(true).setVisible(true);
        reticle.x = player.x;
        reticle.y = player.y -100;
        reticle.setDamping(true);
        reticle.setDrag(0.99);
        reticle.setMaxVelocity(200);

        Bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(player.rotation, 200, player.body.acceleration);
        this.physics.velocityFromRotation(player.rotation,200,reticle.body.acceleration);
    }
    else
    {
        player.setAcceleration(0);
        reticle.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        player.setAngularVelocity(-300);
        reticle.x += Math.sqrt(2,(1*1)-Math.pow(reticle.y-player.y))+player.x; //ทำไงให้หมุนรอบ
        reticle.y += Math.sqrt(2,(1*1)-Math.pow(reticle.x-player.x))+player.y;
    }
    else if (cursors.right.isDown)
    {
        player.setAngularVelocity(300);
        reticle.x -= Math.sqrt(2,(1*1)-Math.pow(reticle.y-player.y))+player.x; //ทำไงให้หมุนรอบ
        reticle.y -= Math.sqrt(2,(1*1)-Math.pow(reticle.x-player.x))+player.y;
    }
    else
    {
        player.setAngularVelocity(0);
        reticle.setAngularVelocity(0);
    }

    if (cursors.space.isDown )
    {
        console.log('fire')
        var bullet = Bullets.get();
        bullet.setActive(true);
        bullet.setVisible(true);

        if (bullet)
        {
            bullet.fire(player,reticle);

        }
    }
    //reticle.rotation = Phaser.Math.Angle.Between(reticle.x, reticle.y, player.x, player.y);
    }
}

export default GameScene;
