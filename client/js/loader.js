const loader = document.querySelector('body > #loader')

export function hide(){
  loader.classList.remove('show')
}

export function show(){
  loader.classList.add('show')
}