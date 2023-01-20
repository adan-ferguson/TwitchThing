import cancelAction from '../../actions/cancelAction.js'

export default {
  baseStats: {
    speed: 30
  },
  items: [
    {
      name: 'Charm',
      abilities: {
        attacked: {
          chance: 1/3,
          description: '1/3 chance to prevent incoming attacks.',
          actions: [
            cancelAction({
              cancelReason: 'charmed'
            })
          ]
        }
      }
    }
  ]
}