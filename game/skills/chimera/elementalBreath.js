export default function(level){
  const magicPower = 3.5 + 1.5 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 20000 + level * 10000,
        actions: [{
          elementalBreath: {
            magicPower,
            burn: magicPower / 4,
            slow: 50 + level * 50,
            weaken: 0.7 * Math.pow(0.8, level - 1) + 'x'
          }
        }]
      }],
    },
    displayName: 'Dragon Breath',
  }
}