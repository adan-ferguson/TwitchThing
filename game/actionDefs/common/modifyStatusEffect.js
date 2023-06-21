export default {
  targets: 'self',
  subject: { // required
    name: null,
    key: null,
    polarity: null
  },
  modification: {  // required
    stacks: 0,
    remove: false
  },
  count: null     // A number of which to modify, otherwise all
}