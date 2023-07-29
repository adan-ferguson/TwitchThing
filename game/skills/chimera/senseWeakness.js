export default function(level){
  const damagePerEnemyDebuff = 0.1 + 0.2 * level
  return {
    effect: {
      stats: {
        damagePerEnemyDebuff
      }
    }
  }
}