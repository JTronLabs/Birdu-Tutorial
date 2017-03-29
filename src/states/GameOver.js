/*
 * GameOver state
 * ==============
 *
 */

export default class GameOver extends Phaser.State {
  create() {
    const txt = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over!',
      this.game.cache.getJSON('font_styles').score);
    txt.anchor.setTo(0.5, 0.5);

    //start over the game
    this.game.time.events.add(Phaser.Timer.SECOND, () => {
      this.state.start('Game');
    }, this);
  }
}
