const loader = document.querySelector('body > #loader')

export function hideLoader(){
  loader.classList.remove('show')
}

export function showLoader(){
  loader.classList.add('show')
}