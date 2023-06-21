export default function(level){
  return {
    orbs: level * 12,
    effect: {
      stats: {
        physPower: (level + 1) + 'x',
        magicPower: (level + 1) + 'x'
      }
    }
  }
}