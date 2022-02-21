const HTML = `
<div class='time'></div>
<div class='text-feed'></div>
`

export default class Feed extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.textFeed = this.querySelector('.text-feed')
  }

  setCombat(combat){
    this.combat = combat
  }

  setTimeline(timeline){
    this.timeline = timeline
    // TODO: show timeline slider if we're not live?
  }

  addEntry(timelineEntry){
    // Add text feed entry
    this.textFeed.textContent = JSON.stringify(timelineEntry)
    this.setTime(timelineEntry.time)
  }

  setTime(time){
    this.querySelector('.time').textContent = (time / 1000).toFixed(1)
  }
}

customElements.define('di-combat-feed', Feed )