const loader = document.querySelector('body > #loader')

export function hideLoader(){
  loader.classList.remove('show')
}

export function showLoader(message = ''){
  loader.querySelector('.message').textContent = message
  loader.classList.add('show')
}