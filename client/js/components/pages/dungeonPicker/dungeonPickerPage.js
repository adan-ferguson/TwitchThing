import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="flex-columns">
  <div class="content-well stuff">Blah blah blah, select dungeon + time here</div>
</div>
`

export default class DungeonPickerPage extends Page {

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    const form = new DIForm({
      async: true,
      action: `/game/adventurer/${this.adventurerID}/enterdungeon/${1}`,
      submitText: 'Go!',
      success: () => this.app.setPage(new DungeonPage(this.adventurerID))
    })

    this.querySelector('.stuff').appendChild(form)
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(){
    const result = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonpicker`)
    if(result.error){
      return result.error
    }else{
      // TODO: something lol
    }
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )