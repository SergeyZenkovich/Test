import Phaser from 'phaser';

var angle;
var person;
var player;

var legs;
var gun;
var cartridgeHolder = 8;
var input;
var bullet;
var mouse;
var gunBack;
var stars;
var platforms;
var cursors;

function RightAngle(angle) {
  angle = angle > 0.75 ? 0.75 : angle;
  angle = angle < -0.75 ? -0.75 : angle;
  return angle;
}
function LeftAngle(angle) {
  if (angle > -2.45 && angle < 0) {
    angle = -2.45;
  } else if (angle < 2.45 && angle > 0) {
    angle = 2.45;
  }
  return angle;
}
function collectStar(player, star) {
  cartridgeHolder += 8;
  console.log(cartridgeHolder);
  star.disableBody(true, true);
}

export default class Person extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('lstar', 'assets/lstar.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('gun', 'assets/handwithgun.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('gunback', 'assets/handswithgunback.png');
    this.load.spritesheet('dude', 'assets/spr.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('dudeLegs', 'assets/sprl.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    input = this.input;
    mouse = this.input.mousePointer;
    this.add.image(400, 300, 'sky');
    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
    this.matter.add
      .image(400, 568, 'ground', null, { isStatic: true })
      .setScale(2);

    player = this.add.sprite(0, 0, 'dude');
    legs = this.add.sprite(0, 0, 'dudeLegs');
    gun = this.add.image(0, 1, 'gun').setOrigin(0, 0.5);
    bullet = this.matter.add.image(0, 0, 'bullet');
    // bullet.disableBody(true, true);

    person = this.add.container(150, 520, [legs, player, gun, bullet]);
    person.setSize(40, 32);
    this.physics.world.enable(person);

    person.body
      .setVelocity(0, 0)
      .setBounce(0, 0)
      .setCollideWorldBounds(true);

    this.input.on(
      'pointermove',
      function(pointer) {
        angle = Phaser.Math.Angle.Between(
          person.list[2].parentContainer.x,
          person.list[2].parentContainer.y,
          pointer.x,
          pointer.y
        );
      },
      this
    );

    this.input.on(
      'pointerdown',
      function() {
        if (cartridgeHolder > 0) {
          bullet = this.physics.add.image(
            person.list[2].parentContainer.x,
            person.list[2].parentContainer.y,
            'bullet'
          );
          bullet.enableBody(
            true,
            person.list[2].parentContainer.x,
            person.list[2].parentContainer.y,
            true,
            true
          );

          this.physics.velocityFromRotation(angle, 500, bullet.body.velocity);
          cartridgeHolder -= 1;
        } else if (cartridgeHolder === 0) {
          console.log('cartridgeHolder is empty!');
        }
      },
      this
    );

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'leftl',
      frames: this.anims.generateFrameNumbers('dudeLegs', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'Lturn',
      frames: [{ key: 'dude', frame: 10 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'Lturnleg',
      frames: [{ key: 'dudeLegs', frame: 6 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'Rturn',
      frames: [{ key: 'dude', frame: 5 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'Rturnleg',
      frames: [{ key: 'dude', frame: 5 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 6,
        end: 13,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'rightl',
      frames: this.anims.generateFrameNumbers('dudeLegs', {
        start: 6,
        end: 13,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.staticGroup();
    stars.create(500, 500, 'star');

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(person, platforms);
    this.physics.add.collider(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.collider(person, stars, collectStar, null, this);
  }
  update() {
    let angle = Phaser.Math.Angle.Between(
      person.list[2].parentContainer.x,
      person.list[2].parentContainer.y,
      input.x,
      input.y
    );

    gunBack = this.add.sprite(0, 1, 'gunback').setOrigin(1, 0.5);

    if (cursors.left.isDown) {
      person.body.setVelocityX(-50);
      person.replace(gun, gunBack);

      player.anims.play('left', true);
      legs.anims.play('leftl', true);
      person.list[2].setRotation(LeftAngle(angle) - Math.PI);
    } else if (cursors.right.isDown) {
      person.body.setVelocityX(50);
      person.replace(person.list[2], gun);

      player.anims.play('right', true);
      legs.anims.play('rightl', true);
      person.list[2].setRotation(RightAngle(angle));
    } else if (person.list[2].texture.key == 'gun') {
      person.list[2].setRotation(RightAngle(angle));
      person.body.setVelocityX(0);
      player.anims.play('Lturn', true);
      legs.anims.play('Lturnleg', true);
    } else {
      person.list[2].setRotation(LeftAngle(angle) - Math.PI);
      person.body.setVelocityX(0);
      player.anims.play('Rturn', true);
      legs.anims.play('Rturnleg', true);
    }

    if (cursors.up.isDown && person.body.touching.down) {
      person.body.setVelocityY(-330);
    }
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Person],
};

var game = new Phaser.Game(config);
