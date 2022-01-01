import ResultsPage from '../results/resultsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'

import '../../timer.js'

const HTML = `
Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span> <di-timer class="hidden"></di-timer>
`

export default class AdventurerRow extends HTMLButtonElement {
  constructor(adventurer, setPageFn){
    super()
    this.classList.add('adventurer-row')

    if(!adventurer) {
      this.innerHTML = 'Create a new Adventurer'
      return
    }

    this.setAttribute('adventurerID', adventurer._id)
    this.innerHTML = HTML
    this.adventurer = adventurer
    this.update()
    this._events(setPageFn)
  }

  update(){
    const adventurer = this.adventurer
    const timer = this.querySelector('di-timer')
    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = adventurer.level
    this.querySelector('.status').textContent = statusText()
    updateTimer()

    function updateTimer(){
      if(adventurer.currentVenture && !adventurer.currentVenture.finished){
        timer.setTimeSince(adventurer.currentVenture.startTime)
        timer.classList.remove('hidden')
        if(adventurer.currentVenture.finished){
          timer.stop()
        }else{
          timer.start()
        }
      }else{
        timer.classList.add('hidden')
      }
    }

    function statusText(){
      if(!adventurer.currentVenture){
        return ''
      }
      return adventurer.currentVenture.finished ? 'Finished' : 'Venturing'
    }
  }

  _setTimer(time){
    const timer = this.querySelector('di-timer')
    timer.time = time
    timer.run()
  }

  _events(setPageFn){
    this.addEventListener('click', () => {
      let page
      if(this.adventurer.currentVenture){
        if(this.adventurer.currentVenture.finished){
          page = new ResultsPage(this.adventurer._id)
        }else{
          page = new DungeonPage(this.adventurer._id)
        }
      }else{
        page = new AdventurerPage(this.adventurer._id)
      }
      setPageFn(page)
    })
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })