
export default function(){
  return {
    baseStats: {
      hpMax: '-10%',
      speed: 40,
      physPower: '-40%',
      magicPower: '+110%'
    },
    items: [
      {
        name: 'TERRIBLE Curse',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              terribleCurse: {
                attackScaling: 1
              }
            }]
          }]
        }
      }
    ],
    displayName: 'Demoted Lucifer'
  }
}