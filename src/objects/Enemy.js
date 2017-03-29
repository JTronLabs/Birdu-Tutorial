/*
 * Enemy
 * ====
 *
 */

export default class Enemy extends Phaser.Sprite {

  get player() {
    return this.game.state.states.Game.player;
  }
  static get maxBirdFrame() {
    return 27;
  }
  static get twoFrameAnimations() {
    return [6, 8, 14, 15, 19, 22, 24];
  }
  static get flapFPS() {
    return 20;
  }

  constructor(game) {
    super(game, 0, 0, 'spritesheet');

    this.anchor.setTo(0.5, 0.5);

    //create all animations at construction (when preallocated in the Pools) to avoid perf hit at run time
    for (var i = 0; i < Enemy.maxBirdFrame; i++) {
      const animationFrames = Enemy.getFlyingFrames(i);
      this.animations.add(Enemy.birdFrameName(i), animationFrames, Enemy.flapFPS * (animationFrames.length / 4), true);
    }

    //enable physics body, kill sprite if it moves out of bounds
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }

  reset() {
    super.reset();

    this.speed = null;

    //play one of the random animations that were created in the constructor
    const randomEnemyFrame = Phaser.Math.between(0, Enemy.maxBirdFrame);
    this.animations.play(Enemy.birdFrameName(randomEnemyFrame));

    this.setSpriteSize();
    this.setAtSidesOfScreen();
  }

  setAtSidesOfScreen() {
    if (Math.random() < 0.5) {
      this.width = Math.abs(this.width); //face right
      this.x = 0;
      this.body.velocity.x = 300;
    } else {
      this.width = -Math.abs(this.width); //face left
      this.x = this.game.world.width;
      this.body.velocity.x = -300;
    }
    this.body.velocity.y = 0;
    this.y = Math.random() * this.game.world.height;
  }

  setSpriteSize() {
    const playerArea = Math.abs(this.player.width * this.player.height);
    const newArea = Phaser.Math.random(playerArea * 0.5, playerArea * 1.2);

    // Find the new width from the given newArea
    const aspectRatio = Math.abs(this.width / this.height);
    const newWidth = Math.sqrt(newArea * aspectRatio);

    this.width = newWidth;
    this.scale.y = this.scale.x;
  }

  //turn a sprite number and frame animation number into the image's frame name in cache
  //example: Enemy.birdFrameName(10,2) returns "b10-1"
  static birdFrameName(spriteNum, frameNum) {
    if (frameNum != undefined) {
      return 'b' + spriteNum + '-' + frameNum;
    } else {
      return 'b' + spriteNum;
    }
  }

  //given a bird's sprite number, create an array with all its frame names.
  //Some bird animations have 2 frames, the rest have 4
  //example: Enemy.getFlyingFrames(10,game) returns ["b10-1","b10-2","b10-3","b10-4"]
  static getFlyingFrames(spriteNum) {
    const numFrames = (Enemy.twoFrameAnimations.includes(spriteNum)) ? 2 : 4;

    var frameNames = [];
    for (var i = 1; i <= numFrames; i++) {
      frameNames.push(Enemy.birdFrameName(spriteNum, i));
    }

    return frameNames;
  }
}
