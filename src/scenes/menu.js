import { Scene } from '../scene'

export class Menu extends Scene {
  constructor(game) {
    super(game);
  }

  render(time) {
    super.render(time);

    this.game.screen.drawImage('backgroundDay')
  }
}