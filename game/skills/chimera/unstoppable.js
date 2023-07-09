export default function(level){
  const minValue = Math.round((-3 + level) * 100 / 2)
  return {
    effect: {
      statsModifiers: {
        speed: {
          minValue
        }
      }
    },
    displayName: 'Relentless',
  }
}