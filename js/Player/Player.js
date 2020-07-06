import Phaser from 'phaser';
import ObjectInteraction from './ObjectInteraction';

const defaultValues = {
  health: 2,
  bullets: 6,
  food: 2,
  keys: 0,
  playerSizes: {
    h: 40,
    w: 32,
  },
};

export default class Player {
  constructor(scene, x, y, container) {
    this.health = defaultValues.health;
    this.bullets = defaultValues.bullets;
    this.food = defaultValues.food;
    this.keys = defaultValues.keys;
    this.h = defaultValues.playerSizes.h;
    this.w = defaultValues.playerSizes.w;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    this.height = this.h;
    this.width = this.w;
    this.mainBody = Bodies.rectangle(
      this.width * 0.05,
      this.height * 0.05,
      this.width * 0.3,
      this.height * 0.5,
      { chamfer: { radius: 6 } }
    );
    this.sensors = {
      bottom: Bodies.rectangle(2, this.width * 0.45, this.height * 0.4, 2, {
        isSensor: true,
      }),
      left: Bodies.rectangle(-(this.width * 0.3), 2, 2, this.height * 0.5, {
        isSensor: true,
      }),
      right: Bodies.rectangle(this.width * 0.3, 2, 2, this.height * 0.5, {
        isSensor: true,
      }),
      objectSensor: Bodies.rectangle(
        0,
        0,
        this.width * 0.4,
        this.height * 0.4,
        {
          isSensor: true,
        }
      ),
      around: Bodies.rectangle(0, 0, this.width * 0.5, this.height * 0.5, {
        isSensor: true,
      }),
    };
    const compoundBody = Body.create({
      parts: [
        this.mainBody,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
        this.sensors.around,
        this.sensors.objectSensor,
      ],
      frictionStatic: 0.1,
      frictionAir: 0.02,
      friction: 0.1,
    });

    this.matterEnabledContainer = scene.matter.add.gameObject(container);
    this.matterEnabledContainer
      .setExistingBody(compoundBody)
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
      objectA: [
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
        this.mainBody,
      ],
      callback: this.onSensorCollide,
      context: this,
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
        this.mainBody,
      ],
      callback: this.onSensorCollide,
      context: this,
    });

    this.objectInteraction = new ObjectInteraction(scene, this);
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
