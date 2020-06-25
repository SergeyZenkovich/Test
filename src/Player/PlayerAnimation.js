import Phaser from 'phaser';
import Player from './PlayerNew';
import gunImage from '../../assets/Player/handwithgun.png';
import bulletImage from '../../assets/Player/bullet.png';
import gunbackImage from '../../assets/Player/handswithgunback.png';
import dudeImage from '../../assets/Player/spr.png';
import dudeLegsImage from '../../assets/Player/sprl.png';
let angle;
let person;
let body;

let legs;
let gun;
let cartridgeHolder = 8;
let input;
let bullet;
let gunBack;
let cursors;

const playerSizes = {
  h: 40,
  w: 32,
};

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

export default class PersonAnimation {
  constructor(scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.image('gun', gunImage);
    this.scene.load.image('bullet', bulletImage);
    this.scene.load.image('gunback', gunbackImage);
    this.scene.load.spritesheet('dude', dudeImage, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.scene.load.spritesheet('dudeLegs', dudeLegsImage, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    input = this.scene.input;

    body = this.scene.add.sprite(0, 0, 'dude');
    legs = this.scene.add.sprite(0, 0, 'dudeLegs');
    gun = this.scene.add.image(0, 1, 'gun').setOrigin(0, 0.5);
    bullet = this.scene.matter.add.image(0, 0, 'bullet');

    person = this.scene.add.container(107, 168, [legs, body, gun, bullet]);

    this.playerInstance = new Player(this.scene, 107, 168, playerSizes, person);
    console.log(person);

    this.scene.input.on(
      'pointermove',
      function(pointer) {
        angle = Phaser.Math.Angle.Between(
          person.list[2].parentContainer.x,
          person.list[2].parentContainer.y,
          pointer.x + this.scene.cameras.main.scrollX,
          pointer.y + this.scene.cameras.main.scrollY
        );
        if ( person.list[2].parentContainer.x > pointer.x){
          gunBack = this.scene.add.image(0, 1, 'gunback').setOrigin(1, 0.5);
          person.replace(gun, gunBack);
          body.anims.play('Lturn', true);
          legs.anims.play('Lturnleg', true);
        }
        else if( person.list[2].parentContainer.x < pointer.x){
          console.log([person.list[2].parentContainer.x,  pointer.x + this.scene.cameras.main.scrollX])
          person.replace(person.list[2], gun);
          body.anims.play('Rturn', true);
          legs.anims.play('Rturnleg', true);
        }
      },
      this
    );

    //Shooting

    // this.input.on(
    //   'pointerdown',
    //   function() {
    //     if (cartridgeHolder > 0) {
    //       bullet = this.matter.add.image(
    //         person.list[2].parentContainer.x,
    //         person.list[2].parentContainer.y,
    //         'bullet'
    //       );
    //       let force = new Phaser.Math.Vector2();

    //       bullet.applyForce({ x: 0.001, y: 0.002 });
    //       cartridgeHolder -= 1;
    //     } else if (cartridgeHolder === 0) {
    //       console.log('cartridgeHolder is empty!');
    //     }
    //   },
    //   this
    // );

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'leftl',
      frames: this.scene.anims.generateFrameNumbers('dudeLegs', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'Lturn',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 6,
        end: 8,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'Lturnleg',
      frames: [{ key: 'dudeLegs', frame: 6 }],
      frameRate: 20,
    });
    this.scene.anims.create({
      key: 'Rturn',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 3,
        end: 5,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'Rturnleg',
      frames: [{ key: 'dudeLegs', frame: 3 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 6,
        end: 13,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'rightl',
      frames: this.scene.anims.generateFrameNumbers('dudeLegs', {
        start: 6,
        end: 13,
      }),
      frameRate: 10,
      repeat: -1,
    });

    cursors = this.scene.input.keyboard.createCursorKeys();
    
    return this.playerInstance;
    
  }
  update() {

    gunBack = this.scene.add.image(0, 1, 'gunback').setOrigin(1, 0.5);

    if (cursors.left.isDown) {
      person.replace(gun, gunBack);
      console.log(person.list[2].parentContainer.x);

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

