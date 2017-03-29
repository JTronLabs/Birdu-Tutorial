/*
 * Player
 * ====
 * Main Player
 */

export default class Player extends Phaser.Sprite {

  constructor(game) {
    super(game, game.world.centerX, game.world.centerY, 'spritesheet');

    this.animations.add('idling', ['b17-1', 'b17-2', 'b17-3', 'b17-4'], 20, true);
    this.animations.play('idling');

    this.width = 60;
    this.scale.y = this.scale.x;
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(0.4);
    this.body.drag.setTo(70, 70);
  }
  update() {
    //this.game.debug.geom(this.getBounds()); //show where the physics body is
    this.move();
  }

  move() {
    this.animations.getAnimation('idling').speed = 25;
    let playerSpd = 300;
    let minDistToGoal = this.width / 5;

    if (!this.goal_point) { //define if undefined
      this.goal_point = new Phaser.Point(0, 0);
    }
    const distToPointer = Phaser.Point.distance(this, this.goal_point);

    //detect mouse/tap clicks, and update player's desired destination
    if (this.game.input.activePointer.isDown) {
      this.goal_point.x = this.game.input.activePointer.x;
      this.goal_point.y = this.game.input.activePointer.y;

      this.goTowardsLastActivePointer = true;
    }

    //move player towards his desired destination (if he has one made from a click/tap), and turn it off when he reaches it
    if (this.goTowardsLastActivePointer) {
      const rads = Phaser.Math.angleBetweenPoints(this, this.goal_point);
      const angle = Phaser.Math.radToDeg(rads);
      this.angle = angle;
      this.scale.y = (Math.abs(angle) > 90) ? -Math.abs(this.scale.y) : Math.abs(this.scale.y);

      if (distToPointer < minDistToGoal) {
        this.goTowardsLastActivePointer = false; //don't move towards last click's position anymore, you've reached it!
      }

      const slowDownDist = this.width / 2;
      playerSpd = Phaser.Math.linear(0, playerSpd, Math.min(slowDownDist, distToPointer) / slowDownDist);
      this.game.physics.arcade.velocityFromAngle(angle, playerSpd, this.body.velocity);
    }
    //NOT MOVING
    else {
      this.animations.getAnimation('idling').speed = 10; //slow down wing flaps
      this.body.gravity.y = 100; //restart gravity

      this.stabilizeRotationWhenStill();
    }
  }

  stabilizeRotationWhenStill() {
    const absRot = Math.abs(this.body.rotation);
    const rotationDir = (absRot > 90) ? 1 : -1;
    const rotationDelta = (absRot < 180 && absRot > 0) ? rotationDir * Phaser.Math.sign(this.body.rotation) : 0;
    this.body.rotation += rotationDelta;
  }
}
