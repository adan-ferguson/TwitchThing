/**
 *
 * @param combat
 * @param subject
 * @param sourceAbilityInstance
 * @param statusEffectData
 */
export function gainStatusEffect(combat, subject, sourceAbilityInstance, statusEffectData){
  const state = {
    sourceEffectId: sourceAbilityInstance?.parentEffect.uniqueID ?? null
  }
  const existing = subject.statusEffectInstances.find(sei => {
    if(statusEffectData.stackingId){
      return statusEffectData.stackingId === sei.stackingId
    }
    return state.sourceEffectId === sei.sourceEffectId
  })
  if(existing){
    existing.replaceData(statusEffectData)
    if(existing.stacking === 'replace'){
      existing.refresh()
    }else if(existing.stacking === 'extend'){
      existing.extend()
    }else if(existing.stacking === 'stack'){
      existing.addStack()
    }
    return
  }
  subject.addStatusEffect(statusEffectData, state)
}

export function gainBlockBarrier(combat, subject, multiplier = 1){
  const block = subject.stats.get('block').value
  if(block){
    gainStatusEffect(combat, subject, null, {
      stackingId: 'block',
      polarity: 'buff',
      stacking: 'replace',
      name: 'block',
      barrier: {
        hp: Math.ceil(subject.hpMax * block) * multiplier
      }
    })
  }
}
