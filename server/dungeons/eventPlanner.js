export async function generateEvent(dungeonRun){
  if(dungeonRun.events.length >= 10){
    return {
      finished: true,
      message: 'You leave because it\'s really boring.'
    }
  }else if(dungeonRun.events.length <= 0){
    return {
      message: 'You enter the dungeon.'
    }
  }
  return {
    message: 'Nothing happens because the dungeon is empty.'
  }
}