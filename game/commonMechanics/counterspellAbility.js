export function counterspellAbility(cooldown){
  return {
    abilityId: 'counterspell',
    trigger: 'enemyUseActiveAbility',
    cooldown,
    replacements: {
      cancel: 'countered'
    }
  }
}