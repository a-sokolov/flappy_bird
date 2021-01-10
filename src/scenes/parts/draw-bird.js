import { ScenePart } from '../../scene-part'

export class DrawBird extends ScenePart {
  constructor(scene) {
    super(scene)

    this.imageName = ''
    this.x = 0
    this.y = 0
  }

  setImage(imageName) {
    this.imageName = imageName
  }

  setCoordinates(x, y) {
    this.x = x
    this.y = y
  }

  render(time) {
    super.render(time)

    const { screen } = this.scene.game

    screen.drawImage(this.imageName, this.x, this.y)
  }
}