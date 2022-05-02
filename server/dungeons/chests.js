import { generateRandomItemDef } from '../items/generator.js'

export function generateRandomChest(dungeonRun, options = {}){

  const contents = {}
  const features = dungeonRun.user.features
  const level = options.level || dungeonRun.floor
  const tier = options.tier || 1

  // TODO: something that doesn't suck here
  const val = Math.ceil((tier > 1 ? level : Math.ceil(level * Math.random())) * 0.6)
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