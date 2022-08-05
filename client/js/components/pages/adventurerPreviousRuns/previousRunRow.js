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
    <div class="chests">Chests: ${chests.map(c => c ?? 0).join('/') || 0}</div>
    <div class="relics">Relics: ${relicStr(relics)}</div>
</div>
<div class="flex-rows">
    <a href="/watch/dungeonrun/${_id}" target="_blank">View <i class="fa-solid fa-up-right-from-square"></i></a>
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
  relics.forEach((rel, i) => {
    if(!rel?.solved){
      return
    }
    r[i] = rel.solved
  })
  return r.map(r => r ?? 0).join('/')
}