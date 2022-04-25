import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'
import zones from '../../../../../game/zones.js'

const HTML = `
<div class="content-well">
  <div class="content-well stuff"></div>
</div>
`

export default class DungeonPickerPage extends Page{

  form

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.form = new DIForm({
      async: true,
      action: `/game/adventurer/${this.adventurerID}/enterdungeon/main`,
      submitText: 'Go!',
      success: () => this.redirectTo(new DungeonPage(this.adventurerID))
    })

    this.querySelector('.stuff').appendChild(form)
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(){

    const { adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonpicker`)
    if(error){
      return error
    }

    debugger
    this.form.addSelect({
      label: 'Select starting floor',
      optionsList: startingZoneOptions(adventurer.accomplishments.highestFloor)
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )

function startingZoneOptions(topFloor){
  const maxZone = Math.min(zones.length - 1, Math.floor(topFloor - 1 / 10))
  const options = []
  for(let i = maxZone; i >= 0; i--){
    options.push({ value: i, name: `${zones[i]} (${i * 10 + 1})` })
  }
  return options
}