export default function(tier){
  return {
    baseStats: {
      speed: 5 + tier * 70,
    }
  }
}