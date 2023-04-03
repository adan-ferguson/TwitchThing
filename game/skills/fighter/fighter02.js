export default {
  levelFn(level){
    const fighter = -level
    return {
      displayName: 'Slot 8 Only',
      loadoutModifiers: {
        allItems: {
          orbs: {
            fighter: fighter
          }
        },
        self: {
          restrictions: {
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