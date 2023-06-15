export function counterspellAbility(cooldown){
  return {
    abilityId: 'counterspell',
    trigger: 'enemyUseAbility',
    conditions: {
      source: {
        trigger: 'active'
      }
    },
    cooldown,
    replacements: {
      cancel: 'countered'
    }
  }
}