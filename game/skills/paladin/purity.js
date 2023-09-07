export default function(level){
  return {
    loadoutModifiers: [{
      loadoutModifierId: 'purity',
      subject: {
        key: 'all'
      },
      orbs: {
        paladin: -level
      }
    }]
  }
}