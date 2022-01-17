export default class Loadout extends HTMLElement {
  constructor() {
    super()
    this.classList.add('content-well')
  }
}

customElements.define('di-loadout', Loadout)