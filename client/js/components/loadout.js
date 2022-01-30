export default class Loadout extends HTMLElement {
  constructor() {
    super()
    this.displayMode = 'normal'
  }

  setDisplayMode(displayMode) {
    this.displayMode = displayMode
  }
}

customElements.define('di-loadout', Loadout)