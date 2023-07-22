export default function(level){
  const magicPower = 2 + level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 30000 + level * 30000,
        actions: [{
          elementalBreath: {
            magicPower,
            burn: magicPower / 4,
            slow: 50 + level * 50,
            weaken: 0.7 * Math.pow(0.8, level - 1)
          }
        }]
      }],
    },
    displayName: 'Dragon Breath',
  }
}