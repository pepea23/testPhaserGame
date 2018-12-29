let width, height;
let x, y, distX, distY;
let player, bullets, bombs;
let bomb;
let scoreText, topScoreText, dataText;
let cursors, emitter;
let gameover = false;



class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('arrow', '../../images/arrow.png');
        this.load.image('star', '../../images/size1.png');
        this.load.image('bullet', '../../images/bullet.png');
        
        
        
    }

    create() {
        width = this.scene.scene.physics.world.bounds.width;
        height = this.scene.scene.physics.world.bounds.height;
        x = width * 0.5;
        y = height * 0.5;

        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#FFFFFF' });
        topScoreText = this.add.text(1050, 16, 'Top Score: 0', { fontSize: '20px', fill: '#FFFFFF' });
        dataText = this.add.text(485, 16, 'Use [A][S][W][D] or [←][↑][↓][→] to MOVE', { fontSize: '12px', fill: '#FFFFFF' });
        dataText = this.add.text(550, 36, 'Use [SPACE] to SHOOT', { fontSize: '12px', fill: '#FFFFFF' });

        player = this.physics.add.image(x, y, 'arrow').setScale(0.2);
        player.setDamping(true);
        player.setDrag(0.99);
        player.setMaxVelocity(200);
        

        cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        bombs = this.physics.add.staticGroup();
        bombs.create(600, 400, 'star');
        bombs.create(50, 250, 'star');
        bombs.create(750, 220, 'star');
        


        this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });

        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    
                this.speed = 0;
                this.born = 0;
            }
        });

        this.physics.add.collider(player, bombs, () => {
            gameover = true;
        });

        
        

        
    }

    update() {
       

        if (cursors.up.isDown || this.keyW.isDown)
        {
            this.physics.velocityFromRotation(player.rotation, 500, player.body.acceleration);
            var particles = this.add.particles('bullet').setScale(0.2);
            var circle = new Phaser.Geom.Circle(player.x*5, player.y*5, 50);
            var k = 3;
            var rose = {
                getPoints: function (quantity, stepRate)
                {
                    if (!stepRate)
                    {
                        stepRate = Phaser.Math.PI2 / quantity;
                    }
            
                    var input = Phaser.Utils.Array.NumberArrayStep(0, Phaser.Math.PI2, stepRate);
                    var output = new Array(input.length);
            
                    for (var i = 0; i < input.length; i++)
                    {
                        var angle = input[i];
                        output[i] = new Phaser.Math.Vector2().setToPolar(angle, 200 * Math.cos(k * angle));
                    }
            
                    return output;
                }
            };
            var emitter = particles.createEmitter({
            x: player.x*5,
            y: player.y*5,
            //angle: { min: 100, max: 180 },
            //speed: 100,
            //gravityY: 20,
            //lifespan: { min: 1000, max: 2000 },
            blendMode: 'SCREEN',
            deathZone: { type: 'onLeave', source: circle },
            scale: { start: 0.5, end: 0 },
            emitZone: { type: 'edge', source: rose, quantity: 360 }
            });
        }
        else
        {
            player.setAcceleration(0);
        }

        if (cursors.left.isDown || this.keyA.isDown )
        {
            player.setAngularVelocity(-300);
        }
        else if (cursors.right.isDown || this.keyD.isDown)
        {
            player.setAngularVelocity(300);
        }
        else
        {
            player.setAngularVelocity(0);
        }

        if (cursors.space.isDown)
        {
            var bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);
        }

        // if (gameover == true) {
        //     this.physics.pause();
        // }

        this.physics.world.wrap(player, 16);
        this.physics.world.wrap(bombs, 16);

    }
}

export default GameScene;
