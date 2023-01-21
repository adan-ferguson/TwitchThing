import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import MonsterInstance from '../../../../../game/monsterInstance.js'

const ROW_HTML = (floor, room, description) => `
<span class="floor">${floor}-${room}</span>
<di-bar class="hp-pct"></di-bar>
<span class="desc">${description}</span>
`

export default class EventLog extends HTMLElement{
  constructor(timeline, adventurer, options = {}){
    super()

    this._timeline = timeline

    options = {
      rowsClickable: true,
      ...options
    }

    const addEvent = (event, i) => {
      if(!event){
        return
      }
      if(shouldSkip(event)){
        return
      }
      const row = new EventLogRow(event, adventurer)
      row.classList.toggle('clickable', options.rowsClickable)
      row.addEventListener('click', () => {
        if(row.classList.contains('current') || !options.rowsClickable){
          return
        }
        this.dispatchEvent(new CustomEvent('event_selected', {
          detail: {
            eventIndex: i
          }
        }))
      })
      this.appendChild(row)
      return row
    }

    timeline.on('entry_added', event => {
      const row = addEvent(event, timeline.entries.length - 1)
      if(row){
        this._setCurrent(row)
      }
    })

    timeline.entries.forEach((event, i) => {
      addEvent(event, i)
    })
  }

  updateCurrent(scrollIntoView = false){
    const rows = this.querySelectorAll('di-event-log-row')
    let i
    for(i = 0; i < rows.length; i++){
      if (rows[i].event.time >= this._timeline.time){
        break
      }
    }
    const row = rows[i - 1]
    this._setCurrent(row)
    if(scrollIntoView){
      row.scrollIntoView()
    }
  }

  _setCurrent(row){
    this.querySelector('.current')?.classList.remove('current')
    const atBottom = this.scrollHeight <= this.scrollTop + this.offsetHeight + 50
    row.classList.add('current')
    if(atBottom){
      row.scrollIntoView()
    }
  }
}

class EventLogRow extends HTMLElement{
  constructor(event, adventurer){
    super()
    this.event = event
    const desc = (DESCRIPTION_FNS[event.roomType] ?? DESCRIPTION_FNS.unknown)(event)
    this.innerHTML = ROW_HTML(
      event.floor,
      event.room ?? 0,
      desc
    )

    const adv = new AdventurerInstance(adventurer, event.adventurerState)
    const hpBar = this.querySelector('di-bar')
    hpBar.setOptions({
      max: 1,
      showLabel: false,
      showValue: false,
      rounding: false
    })
    hpBar.setValue(adv.hpPct)
  }
}

function shouldSkip(event){
  if(event.wandering || event.roomType === 'combatResult'){
    return true
  }
  return false
}

const DESCRIPTION_FNS = {
  unknown: () => '',
  stairs: event => 'Stairs',
  entrance: event => 'Entrance',
  rest: evemt => 'Rest',
  combat: event => `vs. ${new MonsterInstance(event.monster).displayName}`
}

customElements.define('di-event-log', EventLog)
customElements.define('di-event-log-row', EventLogRow)