
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
            initialCooldown: 10000,
            abilityId: 'terribleCurse',
            actions: [{
              terribleCurse: true
            }]
          }]
        }
      },{
        name: 'Satanic Satin',
        effect: {
          effectId: 'satanicSatin',
          stats: {
            ccResist: '100%'
          }
        }
      }
    ],
    displayName: 'Demoted Lucifer'
  }
}