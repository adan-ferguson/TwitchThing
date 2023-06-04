export default function(level){
  const magicPower = 2.5 + 0.5 * level
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown: 10000,
        actions: [{
          attack: {
            scaling: {
              magicPower
            },
            damageType: 'magic',
            range: [0, 1]
          }
        }]
      }]
    }
  }
}