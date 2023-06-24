export default function(level){
  const val = level + 1
  return {
    effect: {
      stats: {
        cooldownMultiplier: val + 'x',
        magicPower: val + 'x'
      }
    }
  }
}