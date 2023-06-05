export default function(level){
  const magicPower = 2.4 + 0.6 * level
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown: 7000 + level * 1000,
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