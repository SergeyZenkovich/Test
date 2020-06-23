import Phaser from 'phaser';
import HealtBar from './HealthBar';
import WeaponMagazine from './WeaponMagazine';

import gameBar from '../../assets/interface/gameBarFrame.png';
import bullet from '../../assets/interface/bullet.png';
import bulletBG from '../../assets/interface/bulletBG.png';

import { intarfaceTestInGameBar } from '../test/interfaceTest';

const magazineSize = 6;
const textConfig = {
  fontFamily: 'font1',
  fontSize: 24,
};
const percentageXOffsets = {
  healthText: 0.1206,
  healthBar: 0.1447,
  weaponText: 0.4984,
  weaponMagazine: 0.5305,
  foodText: 0.7797,
  keysText: 0.9566,
};
/* default values of game bar items */
const defaultValues = {
  health: 2,
  bullets: magazineSize,
  food: 2,
  keys: 0,
};

export default class GameBar extends Phaser.Scene {
  constructor() {
    super('game-bar');
  }

  init(startValues) {
    this.startValues = startValues || defaultValues;
  }

  preload() {
    this.load.image('gameBar', gameBar);
    this.load.image('bullet', bullet);
    this.load.image('bulletBG', bulletBG);
  }

  create() {
    this.addItems();
    this.changePosition();
    this.scale.on('resize', this.changePosition, this);
    intarfaceTestInGameBar(this);
  }

  changePosition() {
    const YOffset = this.cameras.main.height - (this.frame.displayHeight / 2);

    const healthOffset = this.calculateOffset(percentageXOffsets.healthText);
    const healthBarOffset = this.calculateOffset(percentageXOffsets.healthBar);
    const bulletsOffset = this.calculateOffset(percentageXOffsets.weaponText);
    const magazineOffset = this.calculateOffset(percentageXOffsets.weaponMagazine);
    const foodOffset = this.calculateOffset(percentageXOffsets.foodText);
    const keysOffset = this.calculateOffset(percentageXOffsets.keysText);

    this.frame.setPosition(this.cameras.main.centerX, YOffset);
    this.health.setPosition(healthOffset, YOffset + 3);
    this.healthBar.setPosition(healthBarOffset, YOffset - 10);
    this.bullets.setPosition(bulletsOffset, YOffset + 3);
    this.magazine.setPosition(magazineOffset, YOffset + 2);
    this.food.setPosition(foodOffset, YOffset + 3);
    this.keys.setPosition(keysOffset, YOffset + 3);
  }

  addItems() {
    this.frame = this.add.image(0, 0, 'gameBar').setScale(0.8);
    this.healthBar = new HealtBar(this, 0, 0);
    this.magazine = new WeaponMagazine(this, magazineSize, magazineSize, 0, 0);
    this.health = this.add.text(0, 0, this.startValues.health, textConfig).setOrigin(0.5);
    this.bullets = this.add.text(0, 0, this.startValues.bullets, textConfig).setOrigin(0.5);
    this.food = this.add.text(0, 0, this.startValues.food, textConfig).setOrigin(0.5);
    this.keys = this.add.text(0, 0, this.startValues.keys, textConfig).setOrigin(0.5);
  }

  calculateOffset(percentageOffset) {
    return (window.innerWidth - this.frame.displayWidth) / 2
    + (percentageOffset * this.frame.displayWidth);
  }

  updateHealth(health) {
    this.health.text = health;
  }

  updateHealthBar(health) {
    this.healthBar.update(health);
  }

  updateBullets(bullets) {
    this.bullets.text = bullets;
  }

  updateMagazine(bullets) {
    this.magazine.updateMagazine(bullets);
  }

  updateFood(food) {
    this.food.text = food;
  }

  updateKeys(keys) {
    this.keys.text = keys;
  }
}
