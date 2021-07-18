const overlay = document.querySelector('#loader')

export function showLoader() {
  overlay.classList.add('show')
}

export function hideLoader() {
  overlay.classList.remove('show')
}