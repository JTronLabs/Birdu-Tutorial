/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Pools from '../objects/Pools';

export default class Game extends Phaser.State {

  create() {
    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'spritesheet', 'bg');
    this.bg1 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'spritesheet', 'bg1');

    this.player = new Player(this.game);
    this.game.add.existing(this.player);

    this.game.spritePools = new Pools(this.game, {
      'Enemy': {
        'class': Enemy,
        'count': 25
      }
    });

    this.score = 0;
    this.scoreLabel = this.add.text(this.game.world.width - 30, 30,
      this.score,
      this.game.cache.getJSON('font_styles').score);
    this.scoreLabel.anchor.setTo(1, 0);

    this.enemySpawnTimer = this.game.time.create();
    this.enemySpawnTimer.start();
    this.enemySpawnTimer.loop(800, () => {
      this.game.spritePools.getPool('Enemy').getFirstDead(true).reset();
    }, this);

    //add an emitter to show little meat crumbs when this player eats something
    this.emitter = this.game.add.emitter(0, 0, 50);
    this.emitter.makeParticles('spritesheet', 'meat');
    this.emitter.setRotation(-720, 720);
    this.emitter.setXSpeed(-100, 100);
    this.emitter.setAlpha(1, 0.1);
    this.emitter.setYSpeed(-100, 0);
    this.emitter.minParticleScale = .5;
    this.emitter.maxParticleScale = 1;
  }

  showCrumbs(x, y, width, height) {
    this.emitter.width = Math.abs(width);
    this.emitter.height = Math.abs(height);
    this.emitter.y = y;
    this.emitter.x = x;

    this.emitter.start(true, 2000, null, Phaser.Math.between(4, 8));
  }

  _incrementScore(amt) {
    this.score += Math.round(amt);
    this.scoreLabel.setText(this.score);
  }

  static enemyCollision(player, enemy) { //groups are second
    this.showCrumbs(player.x, player.y, player.width, player.height)
    const enemyArea = Math.abs(enemy.width * enemy.height);
    const playerArea = Math.abs(player.width * player.height);

    if (playerArea > enemyArea) {
      const enemyScore = Math.sqrt(enemyArea);
      this._incrementScore(enemyScore);
      enemy.kill();
    } else {
      player.kill();
      this.state.start('GameOver');
    }
  }

  update() {
    this.bg.tilePosition.x += 4;
    this.bg1.tilePosition.x += 8;

    const enemies = this.game.spritePools.getPool('Enemy');
    this.game.physics.arcade.collide(this.player, enemies, Game.enemyCollision, null, this);

  }
}
