export function counterspellAbility(cooldown){
  return {
    abilityId: 'counterspell',
    tags: ['spell'],
    trigger: 'enemyUseAbility',
    conditions: {
      source: {
        hasTag: 'spell'
      }
    },
    cooldown,
    replacements: {
      cancel: 'countered'
    }
  }
}