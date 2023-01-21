import dateformat from 'dateformat'
import { betterDateFormat } from '../../timer.js'

const HTML = (_id, {
  time,
  startingFloor,
  endingFloor,
  xp,
  relics,
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
    <div class="relics">Relics: ${relicStr(relics)}</div>
</div>
<div class="flex-rows">
    <a href="/dungeonrun/${_id}" target="_blank">Replay <i class="fa-solid fa-up-right-from-square"></i></a>
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

function relicStr(relics){
  const r = []
  for(let i = 0; i < relics.length; i++){
    const rel = relics[i]
    if(!rel?.solved){
      r[i] = 0
    }else{
      r[i] = rel.solved
    }
  }
  return r.join('/') || 0
}

function chestStr(chests){
  const c = []
  for(let i = 0; i < chests.length; i++){
    const tier = chests[i].tier
    if(!c[tier]){
      c[tier] = 0
    }
    c[tier]++
  }
  return c.map(c => c ?? 0).join('/') || 0
}