export default class EffectRow extends HTMLElement{
  constructor(key, effect, animate = false){
    super()
    this.setAttribute('effect-key', key)
    this.update(effect, animate)
  }

  update(effect, animate = false){
    // Animate if the effect changed in some way, like it got refresh, it got
    // extended, the stack # increase, or whatever.
  }
}
customElements.define('di-effect-row', EffectRow)