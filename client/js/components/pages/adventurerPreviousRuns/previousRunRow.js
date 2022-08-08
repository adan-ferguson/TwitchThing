import dateformat from 'dateformat'

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
    <div class="time">${dateformat(time, 'M:ss')}</div>
    <div class="xp">+${xp} xp</div>
</div>
<div class="flex-rows">
    <div class="monsters">Monsters: ${monstersKilled.length}</div>
    <div class="chests">Chests: ${chestStr(chests)}</div>
    <div class="relics">Relics: ${relicStr(relics)}</div>
</div>
<div class="flex-rows">
    <a href="/watch/dungeonrun/${_id}" target="_blank">Replay <i class="fa-solid fa-up-right-from-square"></i></a>
</div>
`

export default class PreviousRunRow extends HTMLElement{

  _run

  constructor(run){
    super()
    this._run = run

    const finalizedData = run.finalizedData
    this.innerHTML = HTML(run._id, finalizedData)
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
  return chests.map(c => c ?? 0).join('/') || 0
}