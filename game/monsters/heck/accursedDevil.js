
export default function(){
  return {
    baseStats: {
      hpMax: '-30%',
      speed: 40,
      physPower: '-50%',
      magicPower: '+50%'
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