const HTML = 'TODO: this'

export default class LevelupSelector extends HTMLElement{
  constructor(levelups) {
    super()
    this.innerHTML = HTML
  }
}

customElements.define('di-adventurer-levelup-selector', LevelupSelector)