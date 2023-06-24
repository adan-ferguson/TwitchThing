export default function(level){
  const pct = 0.7 + level * 0.5
  return {
    effect: {
      abilities: [{
        trigger: 'gainedHealth',
        actions: [{
          penance: {
            pct
          }
        }]
      }]
    }
  }
}