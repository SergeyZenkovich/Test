/* eslint-disable camelcase */
import Phaser from 'phaser';

import PlayerInteraction from '../Player/PlayerInteraction';
import b_1 from '../../assets/level0/b_1.png';
import b_2 from '../../assets/level0/b_2.png';
import b_3 from '../../assets/level0/b_3.png';
import bak_1 from '../../assets/level0/bak_1.png';
import bak_2 from '../../assets/level0/bak_2.png';
import bak_3 from '../../assets/level0/bak_3.png';
import bak_5 from '../../assets/level0/bak_5.png';
import moons from '../../assets/level0/backgr_3.png';

import door from '../../assets/interaction-objects/Door3.png';
import door_ from '../../assets/interaction-objects/Door1_.png';
import lid from '../../assets/interaction-objects/Lid.png';
import locker from '../../assets/interaction-objects/Locker.png';
import locker_ from '../../assets/interaction-objects/Locker_.png';
import deadBody1 from '../../assets/interaction-objects/DeadBody1.png';
import deadBody2 from '../../assets/interaction-objects/DeadBody2.png';

import { setInteractionObjects } from '../setters/level0';

const heightPerScreen = 350;

export default class Level extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.playerInteraction = {};
  }

  init() {
    // this.scale.scaleMode = Phaser.Scale.SHOW_ALL;
    this.scale.pageAlignVertically = false;
  }

  preload() {
    this.load.image('moons', moons);
    this.load.image('b_1', b_1);
    this.load.image('b_2', b_2);
    this.load.image('b_3', b_3);
    this.load.image('bak_1', bak_1);
    this.load.image('bak_2', bak_2);
    this.load.image('bak_3', bak_3);
    this.load.image('bak_5', bak_5);

    this.load.image('door', door);
    this.load.image('door_', door_);
    this.load.image('lid', lid);
    this.load.image('locker', locker);
    this.load.image('locker_', locker_);
    this.load.image('deadBody1', deadBody1);
    this.load.image('deadBody2', deadBody2);

    this.playerInteraction = new PlayerInteraction(this.scene.scene);
    this.playerInteraction.preload();
  }

  create() {
    this.add.image(1020, 256, 'bak_2');
    this.add.image(648, 132, 'bak_1');
    this.add.image(695, 120, 'moons').setScrollFactor(1.15, 1);
    this.add.image(900, 315, 'bak_5').setScrollFactor(0.9, 1);
    this.add.image(263, 280, 'bak_1').setScrollFactor(0.9, 1);
    this.add.image(256, 256, 'b_1');
    this.add.image(950, 350, 'bak_3').setScrollFactor(0.9, 1);
    this.add.image(767, 256, 'b_2');
    this.add.image(1279, 256, 'b_3');

    setInteractionObjects(this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.playerInteraction.create();

    const startValues = {
      health: this.playerInteraction.playerInstance.health,
      food: this.playerInteraction.playerInstance.food,
      keys: this.playerInteraction.playerInstance.keys,
      bullets: this.playerInteraction.playerInstance.bullets,
    };

    this.scene.launch('game-bar', startValues);

    this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, 1536, 512);
    this.camera.setZoom(this.camera.width / heightPerScreen);
  }

  update() {
    this.playerInteraction.update();
  }
}
