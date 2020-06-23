import Phaser from 'phaser';

export default class HealthBar {
  constructor(scene, x, y, width = 160, height = 20, maxHealth = 100) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxHealth = maxHealth;
    this.proportion = width / this.maxHealth;
    this.currentHealth = this.maxHealth;

    this.draw();

    scene.add.existing(this.bar);
  }

  update(health) {
    this.currentHealth = health;

    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }

    this.draw();
  }

  draw() {
    this.bar.clear();

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x, this.y, this.width, this.height);

    //  Health

    if (this.currentHealth < 20) {
      this.bar.fillStyle(0xdba400);
    } else {
      this.bar.fillStyle(0xb32c02);
    }
    const newWidth = Math.floor(this.proportion * this.currentHealth);

    this.bar.fillRect(this.x, this.y, newWidth, this.height);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.draw();
  }
}
