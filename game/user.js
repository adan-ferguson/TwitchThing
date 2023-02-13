export function unlockedClasses(userDoc){
  const classes = userDoc.features.advClasses
  return Object.keys(classes).filter(cls => userDoc.features.advClasses[cls] > 0)
}