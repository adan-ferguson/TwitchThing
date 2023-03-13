import DIElement from '../../diElement.js'

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
  }

  get classDisplays(){
    return this.querySelectorAll('di-adventurer-edit-class-display')
  }

  async showData(parentPage){
    const { adventurer, user } = parentPage
    for(let i = 0; i < 3; i++){
      this.classDisplays[i].setup(user, adventurer, i).events
        .on('spend orb', className => {

        })
        .on('spend skill point', id => {

        })
    }
  }

  _updateAll(){
    this.classDisplays.forEach(cd => cd.update())
  }
}
customElements.define('di-adventurer-edit-points-tab', PointsTab)