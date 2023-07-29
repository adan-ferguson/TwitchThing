export default {
  name: 'fluttering',
  effect: {
    abilities: [flutteringAbility()]
  }
}

export function flutteringAbility(cooldown = 10000){
  return {
    abilityId: 'flutteringDodge',
    trigger: 'attacked',
    conditions: {
      data: {
        cantDodge: false
      }
    },
    cooldown,
    replacements: {
      cancel: 'dodge'
    }
  }
}