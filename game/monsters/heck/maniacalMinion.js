export default function(){
  return {
    baseStats: {
      physPower: '-10%',
      hpMax: '-10%',
      speed: 20,
    },
    items: [{
      name: 'Off the Handle',
      effect: {
        metaEffects: [{
          subject: {
            key: 'self'
          },
          conditions: {
            owner: {
              hasDebuff: true
            }
          },
          effectModification: {
            stats: {
              speed: 100
            }
          }
        }]
      }
    }]
  }
}