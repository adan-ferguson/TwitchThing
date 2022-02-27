import ResultsPage from '../results/resultsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'

import '../../timer.js'

const HTML = `
<div>
    Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span> <di-timer class="displaynone"></di-timer>
</div>
`

export default class AdventurerRow extends HTMLElement{
  constructor(adventurer, setPageFn){
    super()

    if(!adventurer){
      this.innerHTML = 'Create a new Adventurer'
      return
    }

    this.setAttribute('adventurer-id', adventurer._id)
    this.innerHTML = HTML
    this.adventurer = adventurer

    this.querySelector('.name').textContent = this.adventurer.name
    this.querySelector('.level').textContent = this.adventurer.level

    this._events(setPageFn)
  }

  setDungeonRun(dungeonRun){

    this.dungeonRun = dungeonRun

    const timer = this.querySelector('di-timer')
    this.querySelector('.status').textContent = statusText()
    updateTimer()

    function updateTimer(){
      if(!dungeonRun.finished){
        timer.time = dungeonRun.elapsedTime
        timer.classList.remove('displaynone')
        timer.start()
      }else{
        timer.classList.add('displaynone')
      }
    }

    function statusText(){
      if(!dungeonRun){
        return ''
      }
      return dungeonRun.finished ? 'Finished' : 'In Dungeon Run'
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
      if(this.dungeonRun){
        if(this.dungeonRun.finished){
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