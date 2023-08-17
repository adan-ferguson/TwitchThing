import dateformat from 'dateformat'
import { betterDateFormat } from '../../timer.js'

const HTML = (_id, {
  time,
  startingFloor,
  endingFloor,
  xp,
  chests,
}) => `
<div class="flex-rows">
  <div class="floors">Floor ${startingFloor} to ${endingFloor}</div>
  <div class="time">${betterDateFormat(time)}</div>
  <div class="xp">+${xp} xp</div>
</div>
<div class="flex-rows">
  <div class="chests">Chests: ${chestStr(chests)}</div>
</div>
<div class="flex-rows ${_id ? '' : 'displaynone'}">  
  <a href="/game/dungeonrun/${_id}">Replay <i class="fa-solid fa-up-right-from-square"></i></a>
</div>
`

export default class PreviousRunRow extends HTMLElement{

  _run

  constructor(run){
    super()
    this._run = run
    this.innerHTML = HTML(run.purged ? null : run._id, run.results)
  }

}

customElements.define('di-previous-run-row', PreviousRunRow)

function chestStr(chests){
  return Number.isFinite(chests) ? chests : 0
}