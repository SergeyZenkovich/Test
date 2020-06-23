import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y, stringId) {
    this.player = scene.matter.add.image(x, y, stringId);
    this.player.setDensity(10);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.player;
    this.mainBody = Bodies.rectangle(w * 0.5, h * 0.5, w, h, { chamfer: { radius: 6 } });
    this.sensors = {
      bottom: Bodies.rectangle(w * 0.5, h, w * 0.25, 2, { isSensor: true }),
      left: Bodies.rectangle(0, h * 0.5, 2, h * 0.1, { isSensor: true }),
      right: Bodies.rectangle(w, h * 0.5, 2, h * 0.1, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionStatic: 0.1,
      frictionAir: 0.02,
      friction: 0.1,
    });

    this.player
      .setExistingBody(compoundBody)
      .setScale(0.6)
      .setFixedRotation()
      .setPosition(x, y);

    this.isTouching = {
      left: false,
      right: false,
      ground: false,
      body: false,
    };

    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right, this.mainBody],
      callback: this.onSensorCollide,
      context: this,
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right, this.mainBody],
      callback: this.onSensorCollide,
      context: this,
    });
  }

  onSensorCollide({ bodyA, bodyB }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    } else if (bodyA === this.mainBody) {
      this.isTouching.body = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
    this.isTouching.body = false;
  }
}
