import DIElement from '../../diElement.js'
import fizzetch from '../../../fizzetch.js'
import { skillPointEntry, xpIcon } from '../../common.js'
import SimpleModal from '../../simpleModal.js'
import { showLoader } from '../../../loader.js'
import { advXpToLevel } from '../../../../../game/adventurer.js'

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
<div style="flex: 0 1; align-self: center;">
Gain ${skillPointEntry(1)} every 5 levels <button class="refund-points">Refund Points<span class="free-txt"> (Free)</span></span></button>
</div>
`

export default class PointsTab extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.classDisplays.forEach(cd => {
      cd.events
        .on('spend orb', ({ className, count }) => {
          const adv = this.parentPage?.adventurer
          if(!adv){
            return
          }
          count = Math.min(count, adv.unspentOrbs)
          if(!count){
            return
          }
          adv.orbs[className] = (adv.orbs[className] ?? 0) + count
          fizzetch('/game' + this.parentPage.path + '/spendorb', { advClass: className, count })
          this._updateAll()
        })
        .on('spend skill points', async skill => {
          const adv = this.parentPage?.adventurer
          if(!adv || !skill){
            return
          }
          adv.upgradeSkill(skill)
          await fizzetch('/game' + this.parentPage.path + '/spendskillpoint', { skillId: skill.id })
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

    const free = adventurer.doc.state.canRefundForFree
    const btn = this.querySelector('.refund-points')

    if(free){
      btn.classList.add('free')
    }

    btn.addEventListener('click', () => {
      new SimpleModal(msg(adventurer, free), [{
        text: 'Refund',
        style: free ? 'good' : 'scary',
        value: true
      },{
        text: 'Never Mind',
        value: false
      }]).show().awaitResult().then(async result => {
        if(result){
          await fizzetch(`/game/adventurer/${adventurer.id}/refund`)
          this.parentPage.reload()
        }
      })
    })
  }

  _updateAll(){
    this.parentPage.updatePoints()
    this.classDisplays.forEach(cd => cd.update())
  }
}
customElements.define('di-adventurer-edit-points-tab', PointsTab)

function msg(adventurer, free){
  if(free){
    return 'Refund all points? You won\'t lose any xp because this adventurer hasn\'t done anything since its last refund.'
  }else{
    const oldLevel = advXpToLevel(adventurer.xp)
    const newLevel = advXpToLevel(adventurer.xp / 2)
    return  `
      Refund all points? You'll lose half your xp.
      <br/><br/>
      Lvl. ${oldLevel} -> ${newLevel}
      <br/><br/>
      (This is like dismissing an adventurer and creating a new one, but a bit more convenient).`
  }
}