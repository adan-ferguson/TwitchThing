import tippy from 'tippy.js'

export default function(el, text){
  const instance = tippy(el, {
    theme: 'light',
    content: text,
    showOnCreate: true,
    onHidden: () => {
      instance.destroy()
    }
  })
}