import { gainStatusEffect } from '../../gainStatusEffect.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const bountyChest = {
    options: {
      type: 'bounty'
    },
    contents: {
      gold: Math.round(actionDef.value * subject.level * actor.stats.get('goldFind').value)
    }
  }
  return gainStatusEffect(combat, actor, subject, abilityInstance, {
    rewards: {
      chests: bountyChest
    }
  })
}