export function fadeOut(el){
  return new Promise(res => {
    el.animate([
      { opacity: 0 }
    ], {
      duration: 200,
      easing: 'ease-out'
    }).onfinish = () => {
      el.style.opacity = 0
      res()
    }
  })
}

export function fadeIn(el){
  return new Promise(res => {
    el.animate([
      { opacity: 1 }
    ], {
      duration: 200,
      easing: 'ease-out'
    }).onfinish = () => {
      el.style.opacity = 1
      res()
    }
  })
}