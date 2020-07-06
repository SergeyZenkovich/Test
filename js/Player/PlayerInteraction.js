import PersonAnimation from './PlayerAnimation';
import level0json from '../../assets/level0Physics/level-start.xml.json';
import level0MiddleJson from '../../assets/level0Physics/level-middle.xml.json';
import level0EndJson from '../../assets/level0Physics/level-end.xml.json';
import level0stairsJson from '../../assets/level0Physics/level-start-stairs.xml.json';
import level0stairsMiddleJson from '../../assets/level0Physics/level-middle-stairs.xml.json';
import StairsInteraction from '../objects/stairs/StairsInteraction';
import { getCanGoX, setCanGoX } from './helpers/externalParams';

export default class PlayerInteraction {
  constructor(scene) {
    this.playerInstance = {};
    this.player = this.playerInstance.player || {};
    this.movingKeysPressed = false;
    this.scene = scene;
    this.stairsInteraction = {};
    this.stairsArray = [];

    this.PLAYER_SPEED_X = 1.8;
  }

  preload() {
    // this.scene.load.image('hero', hunterPath);
    this.playerAnimation = new PersonAnimation(this.scene);
    this.playerAnimation.preload();
  }

  create() {
    let player = this.playerAnimation.create();
    this.playerInstance = player;

    this.player = this.playerInstance.matterEnabledContainer;

    console.log(this.player);
    this.playerHeight = this.player.height * this.player.scale;

    this.ground = this.scene.matter.add.fromPhysicsEditor(
      250,
      260.65,
      level0json.f_1
    );
    this.ground.frictionStatic = 0.5;
    this.ground.friction = 0.5;

    this.groundMiddle = this.scene.matter.add.fromPhysicsEditor(
      779,
      261,
      level0MiddleJson.f_2
    );

    this.groundEnd = this.scene.matter.add.fromPhysicsEditor(
      1303,
      273,
      level0EndJson.f_3
    );

    this.stairs = this.scene.matter.add.fromPhysicsEditor(
      486,
      235,
      level0stairsJson.f_1
    );
    this.stairsArray.push(this.stairs);
    this.stairs.collisionFilter.mask = 2;
    this.stairsMiddle = this.scene.matter.add.fromPhysicsEditor(
      770,
      315.5,
      level0stairsMiddleJson.f_2
    );
    this.stairsMiddle.collisionFilter.mask = 2;
    this.stairsArray.push(this.stairsMiddle);

    this.camera = this.scene.cameras.main;
    this.camera.startFollow(this.player, false, 0.1, 0.1);
    this.camera.setBounds(0, 0, 1536, 512);
    this.camera.setZoom(1);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    const playerInteractionConfig = {
      scene: this.scene,
      cursors: this.cursors,
      stairsArray: this.stairsArray,
      playerInstance: this.playerInstance,
    };
    this.stairsInteraction = new StairsInteraction(playerInteractionConfig);
  }

  update() {
    this.playerAnimation.update(this.stairsInteraction, this.stairsMiddle);
    this.player.body.ignoreGravity =
      !this.movingKeysPressed &&
      this.playerInstance.isTouching.body &&
      !this.playerInstance.isTouching.left &&
      !this.playerInstance.isTouching.right;
    setCanGoX(true);

    this.stairsInteraction.setStairsOverlap();

    if (this.cursors.left.isDown && getCanGoX()) {
      this.movingKeysPressed = true;
      this.player.setVelocityX(-this.PLAYER_SPEED_X);
    } else if (this.cursors.right.isDown && getCanGoX()) {
      this.movingKeysPressed = true;
      this.player.setVelocityX(this.PLAYER_SPEED_X);
    } else if (this.cursors.down.isDown) {
      console.log(this.stairs);
    } else {
      this.movingKeysPressed = false;
      this.player.setVelocityX(0);
    }

    this.stairsInteraction.controlYMovement();
  }
}
