import Phaser from 'phaser'

class Fire extends Phaser.Sprite {
    constructor (game, x,y) {
        super(game,x,y,'fire')

        this.game.physics.arcade.enableBody(this)

        this.body.immovable = true
    }
}


export default Fire