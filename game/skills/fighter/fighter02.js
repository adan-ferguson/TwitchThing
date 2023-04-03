export default {
  levelFn(level){
    const fighter = -level
    return {
      displayName: 'Slot 8 Only',
      loadoutModifiers: {
        orbs: {
          allItems: {
            fighter: -fighter
          }
        },
        restrictions: {
          self: {
            slot: 8
          }
        }
      },
      vals: {
        fighter
      }
    }
  },
  skillPoints: [1,2,5,'...']
}