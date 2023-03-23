import DIElement from '../../diElement.js'

const HTML = `
<div class="inset-title name"></div>
<div class="absolute-full-size fill-contents standard-contents">
  <di-stats-list class="adventurer-stats"></di-stats-list>
  <di-adventurer-edit-loadout></di-adventurer-edit-loadout>
</div>
`

export default class AdventurerPane extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.statsListEl
      .setOptions({
        maxItems: 10,
        forced: ['hpMax', 'physPower', 'magicPower']
      })
    // TODO: click more stats
  }

  get statsListEl(){
    return this.querySelector('di-stats-list')
  }

  get loadoutEl(){
    return this.querySelector('di-adventurer-edit-loadout')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = `${adventurer.level} - ${adventurer.name}`
    this.updateAll()
  }

  updateAll(showStatChangeEffect = false){
    this.loadoutEl.setLoadout(this.adventurer.loadout)
    this._update(true)
  }

  _update(showStatChangeEffect = false){
    // this.updateStats(showStatChangeEffect)
    // this.updateOrbs()
    // this.loadoutEl.update()
  }

  //
  // setExtraStats(extraStats){
  //   this._extraStats = extraStats
  //   this.update()
  // }
  //
  // updateItems(){
  //   this.adventurerPane.updateStats(true)
  //   this.adventurerPane.updateOrbs()
  // }
  //
  // updateOrbs(){
  //   this.orbRow.setData(this.adventurerInstance.orbs)
  // }
  //
  // updateStats(showStatChangeEffect){
  //   this.statsList.setOptions({
  //     excluded: this._excluded()
  //   }).setStats(this.adventurerInstance.stats, this.adventurerInstance, showStatChangeEffect)
  // }
  //
  // async addXp(toAdd, options = { }){
  //   const advData = this.adventurerInstance.fighterData
  //   this._xpAnimation = true
  //   await this.xpBar.setValue(advData.xp + toAdd, {
  //     ...options,
  //     animate: true,
  //     skipToEndOfAnimation: options.skipAnimation ? true : false,
  //     onLevelup: (level, animate = true) => {
  //       if(animate){
  //         this.update(true)
  //       }
  //       advData.xp = advLevelToXp(level)
  //       options.onLevelup?.(level)
  //     }
  //   })
  //   this.update(true)
  // }
  //
  // skipToEndOfXpAnimation(){
  //   if(this._xpAnimation){
  //     this._xpAnimation = false
  //     this.xpBar.skipToEndOfAnimation()
  //     this.update()
  //   }
  // }
  //
  // _showAdventurerInfoModal(){
  //   const modal = new Modal()
  //   modal.innerContent.appendChild(new AdventurerInfo(this.adventurerInstance, this.statsList.stats))
  //   modal.show()
  // }
}

customElements.define('di-adventurer-edit-adventurer-pane', AdventurerPane )