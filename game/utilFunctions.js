export function toArray(arrayOrVal){
  return Array.isArray(arrayOrVal) ? arrayOrVal : [arrayOrVal]
}