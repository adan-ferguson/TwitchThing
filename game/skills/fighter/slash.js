export default {
  levelFn(level){
    const physPower = 1.3 + 0.2 * level
    return {
      effect: {
        abilities: [{
          trigger: { active: true },
          cooldown: 10000,
          actions: [{
            attack: {
              scaling: {
                physPower
              }
            }
          }]
        }]
      },
      vars: {
        physPower
      }
    }
  }
}