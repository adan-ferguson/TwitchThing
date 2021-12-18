export function generateEvent(dungeonRun){
  if(dungeonRun.events.length >= 10){
    return {
      finished: true,
      message: 'You leave because it\'s really boring.'
    }
  }
  return {
    message: 'Nothing happens because the dungeon is empty.'
  }
}