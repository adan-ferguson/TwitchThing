import * as Adventurer  from '/game/adventurer.js'

const innerHTML = `
<div class="name"></div>
<div>Lvl. <span class="level"></span> - <span class="xp"></span>/<span class="xp-next"></span></div>
<div class="health">Other stats here</div>
`

export default class StatsBox extends HTMLElement {
  constructor(adventurer){
    super()
    this.innerHTML = innerHTML
    this.querySelector('.name').textContent = adventurer.name

    const lvl = Adventurer.xpToLevel(adventurer.xp)
    this.querySelector('.level').textContent = lvl
    this.querySelector('.xp').textContent = adventurer.xp
    this.querySelector('.xp-next').textContent = Adventurer.levelToXp(lvl + 1)

    // TODO: stats
    // const stats = new Stats(adventurer)
    // this.querySelector('.health').textContent = stats.health
  }
}

customElements.define('di-adventurer-statsbox', StatsBox)