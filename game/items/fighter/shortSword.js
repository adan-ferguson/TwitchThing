export default {
  effect: level => {
    return {
      stats: {
        physPower: 10 * level,
      }
    }
  },
  displayName: 'Short Sword',
  orbs: level => level,
  baseId: 'common_1'
}