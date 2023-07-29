export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const killed = combat.getFighterInstance(triggerData.killed)
  const bountyChest = {
    options: {
      type: 'bounty'
    },
    contents: {
      gold: Math.round(actionDef.value * killed.level * actor.stats.get('goldFind').value)
    }
  }
  return {
    applyStatusEffect: {
      targets: 'target',
      statusEffect: {
        rewards: {
          chests: bountyChest
        }
      }
    }
  }
}