import DIElement from '../../diElement.js'
import fizzetch from '../../../fizzetch.js'
import { skillPointEntry } from '../../common.js'

const HTML = `
<div class="adv-classes content-columns">
  <div class="content-well fill-contents">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
  <div class="content-well fill-contents">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
  <div class="content-well fill-contents">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
</div>
<div style="flex: 0 1; align-self: center;">Gain ${skillPointEntry(1)} every 5 levels</div>
`

export default class PointsTab extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.classDisplays.forEach(cd => {
      cd.events
        .on('spend orb', className => {
          const adv = this.parentPage?.adventurer
          if(!adv || !adv.unspentOrbs){
            return
          }
          adv.orbs[className] = (adv.orbs[className] ?? 0) + 1
          fizzetch('/game' + this.parentPage.path + '/spendorb', { advClass: className })
          this._updateAll()
        })
        .on('spend skill points', skill => {
          const adv = this.parentPage?.adventurer
          if(!adv || !skill){
            return
          }
          adv.upgradeSkill(skill)
          fizzetch('/game' + this.parentPage.path + '/spendskillpoint', { skillId: skill.id })
          this._updateAll()
        })
    })
  }

  get classDisplays(){
    return this.querySelectorAll('di-adventurer-edit-class-display')
  }

  async showData(){
    const { adventurer, user } = this.parentPage
    this.classDisplays.forEach((cd, index) => {
      cd.setup(user, adventurer, index)
    })
  }

  _updateAll(){
    this.parentPage.updatePoints()
    this.classDisplays.forEach(cd => cd.update())
  }
}
customElements.define('di-adventurer-edit-points-tab', PointsTab)