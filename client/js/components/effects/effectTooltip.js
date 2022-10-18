import { makeEl, toDisplayName, wrapContent } from '../../../../game/utilFunctions.js'
import StatsList from '../stats/statsList.js'
import { StatsDisplayStyle } from '../../statsDisplayInfo.js'

export function effectTooltip(effect){

  const tt = makeEl({
    class: 'tooltip-content'
  })

  if(effect.stats){
    const statsList = new StatsList()
    statsList.setOptions({
      showTooltips: false,
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    statsList.setStats(effect.stats)
    tt.appendChild(statsList)
  }

  if(effect.mods){
    const modsEl = makeEl({
      class: 'mods-list'
    })
    effect.mods.list.forEach(mod => {
      if(mod.description){
        modsEl.appendChild(wrapContent(mod.description))
      }
    })
    tt.appendChild(modsEl)
  }

  if(effect.description){
    tt.appendChild(makeEl({
      class: 'effect-description',
      content: effect.description
    }))
  }

  return tt
}