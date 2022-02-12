import Stats from '/game/stats.js'

const HTML = `
<div class="flex-rows">
  <div class="stats-box">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <div class="stats"></div>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('adventurer-pane')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.loadout = this.querySelector('di-loadout')
    this.statsbox = this.querySelector('.stats-box')
    this.stats = this.querySelector('.stats')
    this.displayMode = 'normal'
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.hpBar.setBadge(adventurer.level)
    this.querySelector('.name').textContent = adventurer.name
  }

  setState(state = {}){
    const animateChanges = this.state ? true : false
    this.state = state
    this._update(animateChanges)
  }

  _update(animateChanges){
    // TODO: add affectors from items
    // TODO: add affectors from effects
    const stats = new Stats([this.adventurer.baseStats])
    this.hpBar.setRange(0, stats.getCompositeStat('hpMax'))
    this.hpBar.setValue(this.state.hp)

    // TODO: figure out this but better
    const statsToShow = ['attack']
    statsToShow.forEach(statName => {
      const el = document.createElement('div')
      el.innerHTML = `${statName} ${stats.getCompositeStat('hpMax')}`
      this.stats.appendChild(el)
    })
  }
}

customElements.define('di-dungeon-adventurer-pane', AdventurerPane )