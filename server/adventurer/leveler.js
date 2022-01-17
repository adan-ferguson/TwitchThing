export function previewLevelup(adventurer, level){

  const bonusOptions = []

  bonusOptions.push({
    type: 'Some Value A',
    value: 10
  })
  bonusOptions.push({
    type: 'Some Value B',
    value: 10
  })

  // TODO: add options provided by items

  return {
    stats: [{
      type: 'Some Stat',
      value: 8
    }],
    options: bonusOptions,
    level
  }
}