import DIElement from '../../diElement.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="adv-classes content-columns">
  <div class="content-well">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
  <div class="content-well">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
  <div class="content-well">
    <di-adventurer-edit-class-display></di-adventurer-edit-class-display>
  </div>
</div>
<di-adventurer-edit-skill-point-meter></di-adventurer-edit-skill-point-meter>
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
        .on('spend skill point', id => {

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