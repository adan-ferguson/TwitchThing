import cancelAction from '../../actions/cancelAction.js'

export default {
  baseStats: {},
  items: [
    {
      name: 'Charm',
      abilities: {
        attacked: {
          chance: 1/3,
          description: '33% chance for prevent incoming attacks.',
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