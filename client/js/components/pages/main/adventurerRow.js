import '../../timer.js'

const HTML = `
<div class="inner">
    <span>
        Lvl.<span class="level"></span>
    </span>
    <span class="name"></span>
    <span class="status"></span>
    <di-timer class="displaynone"></di-timer>
</div>
<a class="new-tab" target="_blank" title="Open in new tab">[->]</a>
`

export default class AdventurerRow extends HTMLElement{
  constructor(adventurer){
    super()

    this.innerHTML = HTML

    if(!adventurer){
      this.querySelector('.inner').textContent = 'Create a new Adventurer'
      this.querySelector('.new-tab').classList.add('hidden')
      return
    }

    this.setAttribute('adventurer-id', adventurer._id)
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