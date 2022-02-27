const HTML = `
<di-timer></di-timer>
<div class='text-feed'></div>
`

export default class Feed extends HTMLElement{

  constructor(){
    super()
    this.entries = []
    this.innerHTML = HTML
    this.textFeed = this.querySelector('.text-feed')
    this.timer = this.querySelector('di-timer')
    this.timer.format = 'M:ss.L'
  }

  setCombat(combat){
    this.combat = combat
  }

  setTimeline(timeline){
    this.timeline = timeline
    // TODO: show timeline slider if we're not live?
  }

  setText(text){
    if(!text){
      return
    }
    this.textFeed.textContent = text
  }

  setTime(time){
    this.timer.time = time
  }

  addEntry(entry){
    this.entries.push(entry)
  }
}

customElements.define('di-combat-feed', Feed )