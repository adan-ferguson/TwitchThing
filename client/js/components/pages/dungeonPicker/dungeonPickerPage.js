import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'
import zones from '../../../../../game/zones.js'

const HTML = `
<div class="content-well stuff fill-contents"></div>
`

export default class DungeonPickerPage extends Page{

  form

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this.classList.add('flex-no-grow')

    this.form = new DIForm({
      async: true,
      action: `/game/adventurer/${this.adventurerID}/enterdungeon`,
      submitText: 'Go!',
      success: ({ dungeonRun }) => this.redirectTo(new DungeonPage(dungeonRun._id))
    })

    this.querySelector('.stuff').appendChild(this.form)
  }

  get titleText(){
    return this.adventurer.name + ' - Entering Dungeon'
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(){

    const { adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonpicker`)
    if(error){
      return error
    }

    this.adventurer = adventurer
    this.form.addSelect({
      label: 'Select starting zone',
      name: 'startingZone',
      optionsList: startingZoneOptions(adventurer.accomplishments.deepestZone)
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )

function startingZoneOptions(deepestZone){
  const options = []
  for(let i = deepestZone; i >= 0; i--){
    const floor = i * 10 + 1
    options.push({ value: i, name: `${zones[i]} (${floor})` })
  }
  return options
}