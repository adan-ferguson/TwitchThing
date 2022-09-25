export default {
  description: 'It moves like it\'s stop-motion animated.',
  items: [
    {
      name: 'Web Shot',
      ability: {
        type: 'active',
        cooldown: 9000,
        actions: [{
          type: 'effect',
          effect: {
            id: 'webbed'
          },
          affects: 'enemy'
        }]
      }
    }
  ]
}