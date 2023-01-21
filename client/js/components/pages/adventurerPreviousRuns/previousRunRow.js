import dateformat from 'dateformat'
import { betterDateFormat } from '../../timer.js'

const HTML = (_id, {
  time,
  startingFloor,
  endingFloor,
  xp,
  chests,
  monstersKilled
}) => `
<div class="flex-rows">
    <div class="floors">Floor ${startingFloor} to ${endingFloor}</div>
    <div class="time">${betterDateFormat(time)}</div>
    <div class="xp">+${xp} xp</div>
</div>
<div class="flex-rows">
    <div class="monsters">Monsters: ${monstersKilled.length}</div>
    <div class="chests">Chests: ${chestStr(chests)}</div>
</div>
<div class="flex-rows">
    <a href="/game/dungeonrun/${_id}" target="_blank">Replay <i class="fa-solid fa-up-right-from-square"></i></a>
</div>
`

export default class PreviousRunRow extends HTMLElement{

  _run

  constructor(run){
    super()
    this._run = run
    this.innerHTML = HTML(run._id, run.results)
  }

}

customElements.define('di-previous-run-row', PreviousRunRow)

function chestStr(chests){
  return chests.length
}