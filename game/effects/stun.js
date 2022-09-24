export function stunEffect(duration){
  return {
    id: 'stunned',
    duration,
    mods: ['freezeActionBar']
  }
}