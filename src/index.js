import Phaser from 'phaser';
import { Engine, Render, World, Events, Bodies } from 'matter-js';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import Player from './player.js';

var angle;
var person;
var body;
var playerSizes = {
  h: 40,
  w: 32,
};
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
function collectStar(body, star) {
  cartridgeHolder += 8;
  console.log(cartridgeHolder);
  star.disableBody(true, true);
}

export default class Person extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/level.json');
    this.load.image(
      'kenney-tileset-64px-extruded',
      'assets/kenney-tileset-64px-extruded.png'
    );
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

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('kenney-tileset-64px-extruded');
    const groundLayer = map.createDynamicLayer('Ground', tileset, 0, 0);

    groundLayer.setCollisionByProperty({ collides: true });
    body = this.add.sprite(0, 0, 'dude');
    legs = this.add.sprite(0, 0, 'dudeLegs');
    gun = this.add.image(0, 1, 'gun').setOrigin(0, 0.5);
    bullet = this.matter.add.image(0, 0, 'bullet');

    person = this.add.container(150, 310, [legs, body, gun, bullet]);

    this.player = new Player(this, 150, 310, playerSizes, person);

    this.matter.world.convertTilemapLayer(groundLayer);
    console.log(this);
    this.matter.world.setBounds(0, 0, 800, 600);
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
          console.log('Puf!');
          console.log(angle);
          bullet = this.matter.add.image(
            person.list[2].parentContainer.x,
            person.list[2].parentContainer.y,
            'bullet'
          );
          let force = new Phaser.Math.Vector2(0, 0);
          bullet.applyForce(force.setAngle(angle));
          // bullet.enableBody(
          //   true,
          //   person.list[2].parentContainer.x,
          //   person.list[2].parentContainer.y,
          //   true,
          //   true
          // );

          // this.physics.velocityFromRotation(angle, 500, bullet.body.velocity);
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
      frames: [{ key: 'dudeLegs', frame: 3 }],
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

    cursors = this.input.keyboard.createCursorKeys();
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
      person.replace(gun, gunBack);

      body.anims.play('left', true);
      legs.anims.play('leftl', true);
      person.list[2].setRotation(LeftAngle(angle) - Math.PI);
    } else if (cursors.right.isDown) {
      person.replace(person.list[2], gun);

      body.anims.play('right', true);
      legs.anims.play('rightl', true);
      person.list[2].setRotation(RightAngle(angle));
    } else if (person.list[2].texture.key == 'gun') {
      person.list[2].setRotation(RightAngle(angle));
      body.anims.play('Lturn', true);
      legs.anims.play('Lturnleg', true);
    } else {
      person.list[2].setRotation(LeftAngle(angle) - Math.PI);
      body.anims.play('Rturn', true);
      legs.anims.play('Rturnleg', true);
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
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
};

var game = new Phaser.Game(config);
