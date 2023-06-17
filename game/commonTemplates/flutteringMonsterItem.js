export default {
  name: 'fluttering',
  effect: {
    abilities: [flutteringAbility()]
  }
}

export function flutteringAbility(){
  return {
    abilityId: 'flutteringDodge',
    trigger: 'attacked',
    conditions: {
      data: {
        cantDodge: false
      }
    },
    cooldown: 10000,
    replacements: {
      dataMerge: {
        forceDodge: true
      }
    }
  }
}