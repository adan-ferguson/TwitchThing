export function parseAbilityDescriptionString(description, owner = null){
  const props = []
  const formatted = description.replace(/\[(\w)([\d.]+)]/g, (_, type, val) => {
    props.push({
      type,
      val
    })
    return '@'
  })
  return {
    chunks: formatted.split('@'),
    props
  }
}