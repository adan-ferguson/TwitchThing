export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'purity',
      subjectKey: 'all',
      orbs: {
        paladin: -level
      }
    }]
  }
}