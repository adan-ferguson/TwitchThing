import dateformat from 'dateformat'
import RELICS from '../../../relicDisplayInfo.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'

const ROW_HTML = (floor, room, description, time) => `
<span class="time">${floor}-${room}</span>
<span class="desc">${description}</span>
`

export default class EventLog extends HTMLElement{
  constructor(timeline){
    super()
    let currentRow
    timeline.entries.forEach((event, i) => {
      if(shouldSkip(event, timeline.entries[i - 1])){
        return
      }
      const row = new EventLogRow(event)
      if(event === timeline.currentEntry){
        currentRow = row
      }
      row.addEventListener('click', () => {
        if(currentRow === row){
          return
        }
        this.dispatchEvent(new CustomEvent('event_selected', {
          detail: {
            eventIndex: i
          }
        }))
      })
      this.appendChild(row)
    })

    if(currentRow){
      currentRow.classList.add('current')
      currentRow.scrollIntoView()
    }
  }
}

class EventLogRow extends HTMLElement{
  constructor(event){
    super()
    this.classList.add('clickable')

    const desc = DESCRIPTION_FNS[event.roomType ?? 'unknown'](event)
    this.innerHTML = ROW_HTML(event.floor, event.room, desc, dateformat(event.time, 'M:ss'))
  }
}

function shouldSkip(event, prevEvent){
  if(event.floor === prevEvent?.floor && event.room === prevEvent?.room){
    return true
  }
  return false
}

const DESCRIPTION_FNS = {
  unknown: () => '',
  relic: event => `Relic (${RELICS[event.relic.tier].displayName} ${event.relic.type})`,
  stairs: event => 'Stairs',
  entrance: event => 'Entrance',
  combat: event => `Combat vs. ${toDisplayName(event.monster.name)}`
}

customElements.define('di-event-log', EventLog)
customElements.define('di-event-log-row', EventLogRow)