export default function(level){
  const pct = 0.4 + level * 0.3
  return {
    effect: {
      abilities: [{
        trigger: 'gainedHealth',
        actions: [{
          penance: {
            targets: 'enemy',
            pct
          }
        }]
      }]
    }
  }
}