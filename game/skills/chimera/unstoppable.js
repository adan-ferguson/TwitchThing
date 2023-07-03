export default function(level){
  const minValue = (-4 + level) * 100 / 3
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