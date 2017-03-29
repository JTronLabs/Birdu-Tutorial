/*
 * Pools
 * =====
 *
 */

export default class Pools {

  constructor(game, spritesInfo) {
    this.game = game;

    this.pools = {};

    //this can handle the pooling of multiple sprite classes,
    //all indexed by the given key from 'spritesInfo'
    for (let className in spritesInfo) {
      const newPool = this.game.add.group();
      const poolInfo = spritesInfo[className];

      newPool.classType = poolInfo['class']; //set the class to use when expanding
      newPool.createMultiple(poolInfo['count']); //preallocate

      this.pools[className] = newPool;
    }
  }

  getPool(className) {
    return this.pools[className];
  }
}
