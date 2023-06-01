export default function(level){
  const magicPower = 2.4 + 0.35 * level
  return {
    effect: {
      tags: ['magic'],
      abilities: [{
        trigger: { active: true },
        cooldown: Math.floor(7000 * Math.pow(0.9, level - 1)),
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