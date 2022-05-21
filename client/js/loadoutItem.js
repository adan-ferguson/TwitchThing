export function makeLoadoutItem(data){
  return {
    makeTooltip: null,
    makeDetails: null,
    name: '',
    orbs: {},
    ...data }
}