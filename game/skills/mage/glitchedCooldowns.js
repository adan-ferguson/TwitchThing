export default function(level){
  const effect = {
    mods: [{
      glitchedCooldowns: true
    }]
  }
  if(level > 1){
    effect.stats = {
      cooldownMultiplier: Math.pow(0.85, level - 1) + 'x'
    }
  }
  return { effect }
}