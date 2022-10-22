export function parseAbilityDescription(description, owner = null){
  const props = []
  const formatted = description.replace(/\[(\w)([\d.]+)]/g, (_, prop, val) => {
    props.push({
      prop,
      val
    })
    return '$' + (props.length - 1)
  })
  return {
    formatted,
    props
  }
}