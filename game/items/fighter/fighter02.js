export default {
  levelFn: function(level){
    return {
      displayName: 'BIG Weapon',
      loadoutModifiers: {
        neighbouring: {
          restrictions: {
            empty: true
          }
        }
      },
    }
  },
}