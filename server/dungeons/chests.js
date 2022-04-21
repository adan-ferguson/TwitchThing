import { generateRandomItemDef } from '../items/generator.js'

export function generateRandomChest(dungeonRun, options = {}){

  const contents = {}
  const features = dungeonRun.user.features
  const level = options.level || dungeonRun.floor
  const tier = options.tier || 1

  // TODO: something that doesn't suck here
  const val = tier > 1 ? level : Math.ceil((Math.random() + 1 ) * level / 2)
  if(features['items']){
    contents.items = [generateRandomItemDef(val)]
  }

  return generateChest(contents, { ...options, level })
}

export function generateChest(contents, options = {}){
  return {
    contents,
    name: 'Chest',
    level: 1,
    tier: 1,
    ...options
  }
}