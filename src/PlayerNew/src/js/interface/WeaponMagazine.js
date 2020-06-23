/* eslint-disable linebreak-style */
const bulletTexture = 'bullet';
const bulletBGTexture = 'bulletBG';

export default class WeaponMagazine {
  constructor(scene, magazineSize, bulletsNumber, x, y) {
    this.scene = scene;
    this.magazineSize = magazineSize;
    this.bullets = [];
    this.bg = [];
    this.bulletWidth = 0;
    this.bulletsNumber = bulletsNumber;
    this.defineBulletWidth();
    this.init(x, y);
  }

  defineBulletWidth() {
    const temporary = this.scene.add.image(0, 0, bulletTexture);
    this.bulletWidth = temporary.width;
    temporary.destroy();
  }

  init(x, y) {
    for (let i = 0; i < this.magazineSize; i += 1) {
      this.bg.push(this.scene.add.image(x + i * this.bulletWidth, y, bulletBGTexture));
    }
    for (let i = 0; i < this.bulletsNumber; i += 1) {
      this.bullets.push(
        this.scene.add.image(x + i * this.bulletWidth, y, bulletTexture),
      );
    }
  }

  updateMagazine(bulletsNumber) {
    this.bulletsNumber = bulletsNumber;
    this.bullets.slice(0, this.bulletsNumber).forEach((bullet) => bullet.setVisible(true));
    this.bullets.slice(this.bulletsNumber).forEach((bullet) => bullet.setVisible(false));
  }

  setPosition(x, y) {
    this.bg.forEach((bullet, i) => bullet.setPosition(x + i * this.bulletWidth, y));
    this.bullets.forEach((bullet, i) => bullet.setPosition(x + i * this.bulletWidth, y));
  }
}
