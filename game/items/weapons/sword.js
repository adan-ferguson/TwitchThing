export default {
  name: 'Sword',
  active: {
    time: 5,
    actions: [{
      type: 'attack',
      damage: {
        min: 5,
        max: 10,
        type: 'phys'
      }
    }]
  },
  innates: [
    'physDamage'
  ]
}