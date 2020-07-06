import { setCanGoX } from '../../Player/helpers/externalParams';

export default class StairsInteraction {
  constructor(config) {
    this.playerInstance = config.playerInstance;
    this.player = this.playerInstance.matterEnabledContainer;
    this.playerHeight = this.player.height * this.player.scale;
    this.cursors = config.cursors;
    this.scene = config.scene;
    this.stairs = config.stairs;
    this.isPlayerOnPosition = false;
    this.lastStep = false;
    this.stairsArray = config.stairsArray;
    this.distanceMiddle = 100;

    this.LAST_STEP_LENGTH = 1.5;
    this.PLAYER_SPEED_Y = 1.8;
    this.STAIRS_WIDTH = 5;
    this.ALLOWED_DISTANCE_MIDDLE = 6.5;
    this.ALLOWED_DISTANCE_SIDES = 10;
  }

  onStairsHandler = () => {
    this.player.body.ignoreGravity = true;
    if (!(this.lastStep || this.playerInstance.isTouching.ground)) {
      setCanGoX(false);
    }
  };

  positionStairsSetter = (player, stairs) => {
    if (
      (player.position.y < stairs.position.y && this.cursors.down.isDown) ||
      (player.position.y > stairs.position.y && this.cursors.up.isDown)
    ) {
      if (stairs.label === 'stairs-middle') {
        this.player.setPosition(stairs.position.x, player.position.y);
        setCanGoX(false);
      } else if (stairs.label === 'stairs-right') {
        const playerX =
          stairs.bounds.min.x +
          player.centerOffset.x * this.player.scale +
          this.STAIRS_WIDTH;

        if (player.position.y < stairs.bounds.min.y) {
          this.player.setPosition(
            playerX,
            player.position.y + this.playerHeight
          );
          setCanGoX(false);
        } else if (this.distanceMiddle < this.ALLOWED_DISTANCE_MIDDLE) {
          this.player.setPosition(playerX, player.position.y);
          setCanGoX(false);
        }
      } else if (stairs.label === 'stairs-left') {
        const playerX =
          stairs.bounds.max.x -
          player.centerOffset.x * this.player.scale -
          this.STAIRS_WIDTH;

        if (player.position.y < stairs.bounds.min.y) {
          this.player.setPosition(
            playerX,
            player.position.y + this.playerHeight
          );
          setCanGoX(false);
        } else if (this.distanceMiddle < this.ALLOWED_DISTANCE_MIDDLE) {
          this.player.setPosition(playerX, player.position.y);
          setCanGoX(false);
        }
      }
    } else if (
      player.bounds.min.y <= stairs.bounds.min.y &&
      player.position.y >= stairs.bounds.min.y &&
      this.cursors.up.isDown
    ) {
      if (stairs.label === 'stairs-right') {
        this.player.setPosition(
          stairs.bounds.min.x - player.centerOffset.x * this.player.scale,
          stairs.bounds.min.y - player.centerOffset.y * this.player.scale
        );
        this.lastStep = true;
      } else if (stairs.label === 'stairs-left') {
        this.player.setPosition(
          stairs.bounds.max.x + player.centerOffset.x * this.player.scale,
          stairs.bounds.min.y - player.centerOffset.y * this.player.scale
        );
        this.lastStep = true;
      }
    }
  };

  playerStairsOverlap = (bodyA, bodyB) => {
    const playerA = bodyA;
    const stairs = bodyB;
    this.distanceMiddle = Math.abs(playerA.position.x - stairs.position.x);

    const distanceRightSide = Math.abs(
      playerA.position.x -
        (stairs.bounds.max.x -
          this.STAIRS_WIDTH -
          playerA.centerOffset.x * this.player.scale)
    );
    const distanceStairsRight = Math.abs(
      stairs.bounds.min.x + this.STAIRS_WIDTH - playerA.position.x
    );

    const distanceLeftSide = Math.abs(
      playerA.position.x -
        (stairs.bounds.min.x +
          this.STAIRS_WIDTH +
          playerA.centerOffset.x * this.player.scale)
    );
    const distanceStairsLeft = Math.abs(
      stairs.bounds.max.x - this.STAIRS_WIDTH - playerA.position.x
    );

    this.onStairsHandler();

    if (
      (this.distanceMiddle < this.ALLOWED_DISTANCE_MIDDLE &&
        stairs.label === 'stairs-middle') ||
      (distanceStairsLeft < this.ALLOWED_DISTANCE_SIDES &&
        stairs.label === 'stairs-left') ||
      (distanceStairsRight < this.ALLOWED_DISTANCE_SIDES &&
        stairs.label === 'stairs-right')
    ) {
      this.positionStairsSetter(playerA, stairs);
    }
    if (
      this.distanceMiddle === 0 ||
      distanceRightSide === 0 ||
      distanceLeftSide === 0
    ) {
      this.isPlayerOnPosition = true;
    }
  };

  setLastStep = () => {
    this.lastStep = true;
  };

  checkLastStep = (bodyA, bodyB, collisionInfo) =>
    collisionInfo.depth < this.LAST_STEP_LENGTH;

  setStairsOverlap = () => {
    this.scene.matter.overlap(
      this.player,
      this.stairsArray,
      this.setLastStep,
      this.checkLastStep
    );
    this.scene.matter.overlap(
      this.player,
      this.stairsArray,
      this.playerStairsOverlap
    );
  };

  controlYMovement = () => {
    if (this.isPlayerOnPosition) {
      if (this.cursors.up.isDown && !this.lastStep) {
        this.player.setVelocityY(-this.PLAYER_SPEED_Y);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(this.PLAYER_SPEED_Y);
      } else {
        this.player.setVelocityY(0);
      }
    }

    this.lastStep = false;
    this.isPlayerOnPosition = false;
  };
}
