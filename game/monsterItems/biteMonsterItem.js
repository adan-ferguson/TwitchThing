
export default function(def){
  return {
    name: 'Bite',
    abilities: {
      active: {
        initialCooldown: 8000,
        actions: [
          attackAction({
            damagePct: 1.5
          }),
          ({ results }) => {
            const data = results[0].data
            if (data){
              return gainHealthAction({
                scaling: { flat: data.damageDistribution.hp * 0.5 }
              })
            }
          }
        ]
      }
    },
    ...def
  }
}