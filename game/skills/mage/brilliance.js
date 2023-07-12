export default function(level){
  const ratio = 0.5 + level * 0.5
  return {
    effect: {
      transStats: [{
        from: 'combatXP',
        to: 'magicPower',
        ratio
      }],
      vars: {
        ratio
      }
    }
  }
}