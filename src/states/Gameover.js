import Phaser from 'phaser'
import { clone } from 'lodash'
import globals from './globals/index'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    create () {
        let text = this.add.text(
            this.game.width/2, this.game.height/2-52,
            `Game over`,
            {
                font: '62px VT323',
                fill: '#ff5050',
                align: 'center'
            }
        )

        let subtext = this.add.text(
            this.game.width*0.5, this.game.height*0.5,
            `You reached level ${this.game.global.level} with score ${this.game.global.score}`,
            {
                font: '32px VT323',
                fill: '#eee',
                align: 'center'
            }
        )

        let button = this.game.add.button(
            this.game.width/2, this.game.height/2+100,
            'button',
            this.restartGame,
            this,
            2,1,0
        )

        text.anchor.set(0.5)
        subtext.anchor.set(0.5)
        button.anchor.set(0.5)

    }

    restartGame() {
        this.game.global = clone(globals)
        this.game.state.start('Game')
    }
}
