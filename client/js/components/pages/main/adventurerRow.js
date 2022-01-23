import ResultsPage from '../results/resultsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'

import '../../timer.js'

const HTML = `
<div>
    Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span> <di-timer class="displaynone"></di-timer>
</div>
`

export default class AdventurerRow extends HTMLElement {
  constructor(adventurer, setPageFn){
    super()

    if(!adventurer) {
      this.innerHTML = 'Create a new Adventurer'
      return
    }

    this.setAttribute('adventurer-id', adventurer._id)
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
        timer.classList.remove('displaynone')
        if(adventurer.currentVenture.finished){
          timer.stop()
        }else{
          timer.start()
        }
      }else{
        timer.classList.add('displaynone')
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

customElements.define('di-main-adventurer-row', AdventurerRow)