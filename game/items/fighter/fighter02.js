export default {
  levelFn: function(level){
    return {
      displayName: 'BIG Weapon',
      loadoutModifiers: {
        restrictions: {
          neighbouring: {
            empty: true
          }
        }
      },
    }
  },
}