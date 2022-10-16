export default {
  baseStats: {
    physPower: '+25%',
    speed: '-20%',
    hpMax: '+125%'
  },
  items: [
    {
      name: 'Boss Monster',
      description: 'Guards the stairs.',
      stats: {
        rewards: '+200%'
      }
    },{
      name: 'Enrage',
      description: 'Doubles physical power after 30 seconds.',
      conditions: {
        combatTimeAbove: 30000
      },
      stats: {
        physPower: '+100%'
      }
    }
  ]
}