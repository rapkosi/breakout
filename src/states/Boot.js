import Phaser from 'phaser'
import WebFont from 'webfontloader'
import globals from './globals/index'
import { clone } from 'lodash'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#333'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  create () {
    this.initGlobalVariables()
  }

  initGlobalVariables () {
    this.game.global = clone(globals)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['VT323']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px VT323', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    this.load.image('fire', './assets/images/fire.png')

    this.load.image('brick', './assets/images/brick.png')
    this.load.image('paddle', './assets/images/bar.png')
    this.load.image('ball', './assets/images/ball.png')

    this.load.image('button', './assets/images/button.png')
      this.load.image('button_over', './assets/images/button_over.png')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
