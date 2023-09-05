export default function(level){
  const pct = 0.6 + level * 0.4
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