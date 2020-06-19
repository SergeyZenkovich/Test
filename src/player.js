import MultiKey from "./multikey.js";

export default class Player {
    constructor(scene,x,y, playerSizes, container) {

        this.scene = scene;

  
      const { Body, Bodies } = Phaser.Physics.Matter.Matter; 
        
      const mainBody = Bodies.rectangle(0, 0, playerSizes.w * 0.6, playerSizes.h, { chamfer: { radius: 10 } });
      this.sensors = {
        bottom: Bodies.rectangle(0, playerSizes.h * 0.5, playerSizes.w * 0.25, 2, { isSensor: true }),
        left: Bodies.rectangle(-(playerSizes.w * 0.35), 0, 2, playerSizes.h * 0.5, { isSensor: true }),
        right: Bodies.rectangle(playerSizes.w * 0.35, 0, 2, playerSizes.h * 0.5, { isSensor: true })
      };
      
      const compoundBody = Body.create({
        parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
        frictionStatic: 0,
        frictionAir: 0.02,
        friction: 0.1,
        
      });
      this.matterEnabledContainer = scene.matter.add.gameObject(container);
      this.matterEnabledContainer
        .setExistingBody(compoundBody)
        .setFixedRotation() // Sets inertia to infinity so the player can't rotate
        .setPosition(x, y);
      

        const { LEFT, RIGHT, UP} = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(scene, [LEFT]);
        this.rightInput = new MultiKey(scene, [RIGHT]);
        this.jumpInput = new MultiKey(scene, [UP]);
    
        this.scene.events.on("update", this.update, this);
    }

    update() {  
        
        const velocity =  this.matterEnabledContainer.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
    
        const moveForce = 0.004;
    
        if (isLeftKeyDown) {
            // this.matterEnabledContainer.body.setFlipX(true);
            this.matterEnabledContainer.applyForce({ x: -moveForce, y: 0 });
        } else if (isRightKeyDown) {
            // this.matterEnabledContainer.body.setFlipX(false);
            this.matterEnabledContainer.applyForce({ x: moveForce, y: 0 });
        }
    
        // Limit horizontal speed, without this the player's velocity would just keep increasing to
        // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
        // interfere with gravity.
        // console.log( this.matterEnabledContainer);
        // console.log(velocity);
        if (velocity.x > 0.05)  this.matterEnabledContainer.setVelocityX(0.02);
        else if (velocity.x < -0.05)  this.matterEnabledContainer.setVelocityX(-0.02);
    
        if (isJumpKeyDown) {
            this.matterEnabledContainer.setVelocityY(-11);
        }
      }
  }