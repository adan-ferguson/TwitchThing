import '../../timer.js'

const HTML = `
<div class="inner">
    Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span> <di-timer class="displaynone"></di-timer>
</div>
<a class="new-tab" target="_blank">[->]</a>
`

export default class AdventurerRow extends HTMLElement{
  constructor(adventurer){
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

    const newTab = this.querySelector('.new-tab')
    newTab.setAttribute('href', `/game#adventurer=${adventurer._id}`)
    newTab.addEventListener('click', e => {
      e.stopPropagation()
    })
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
}

customElements.define('di-main-adventurer-row', AdventurerRow)