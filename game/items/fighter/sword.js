import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 15000,
        actions: [
          attackAction({
            damageMulti: 1.3 + level * 0.2
          })
        ]
      }
    }
  }),
  orbs: 3,
  mods: [physScaling]
}

//
// export default {
//   levelFn: level => ({
//     abilities: {
//       active: {
//         cooldown: 10000,
//         actions: [
//           takeDamage({
//             damagePct: 0.1,
//             ignoreDefense: true
//           }),
//           (combat, owner, prevResults) => {
//             const dmgResult = prevResults.at(-1)
//             return statusEffect({
//               effect: {
//                 duration: 0,
//                 stats: {
//                   physPower: dmgResult.data.finalDamage * 1.5
//                 }
//               }
//             })
//           },
//           attack()
//         ]
//       }
//     },
//     stats: {
//       physPower: Math.ceil(exponentialValueCumulative(SCALING, level, BASE))
//     },
//   }),
//   description: 'This is a generic sword for testing.',
//   displayName: 'Sword With Display Name',
//   orbs: 1,
//   mods: [physScaling]
// }