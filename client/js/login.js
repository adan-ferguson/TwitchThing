import { Magic } from 'magic-sdk'
const form = document.querySelector('#login-widget form')
const magic = new Magic(window.magicPublishableKey)

form.onsubmit = e => {
  e.preventDefault()
  const email = new FormData(e.target).get('email')
  if(!email) {
    return
  }
  sendLink(email)
}

async function sendLink(email){
  const didToken = await magic.auth.loginWithMagicLink({ email })
  const result = await fetch('/user/login', {
    headers: new Headers({
      Authorization: 'Bearer ' + didToken
    }),
    withCredentials: true,
    credentials: 'same-origin',
    method: 'POST'
  })
  if(result.status === 200){
    window.location = '/game'
  }
}