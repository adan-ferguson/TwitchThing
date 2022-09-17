export function statEffect(stats){
  return {
    type: 'stat',
    duration: 0, // milliseconds, 0 = ends immediately after this tick's actions
    stats
  }
}

/**
 * Dodge incoming attacks/abilities
 * @returns {{type: 'dodge'}}
 */
export function dodgeEffect(){
  return {
    type: 'dodge'
  }
}