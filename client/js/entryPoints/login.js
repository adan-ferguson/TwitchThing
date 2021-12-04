import { Magic } from 'magic-sdk'
import DIForm from '../components/form.js'

const diform = new DIForm()
diform.addInput({
  type: 'email',
  name: 'email',
  required: 'required',
  placeholder: 'Enter your e-mail address'
})
diform.addSubmitButton('Login  / Signup')
document.querySelector('.login-form').appendChild(diform)

const magic = new Magic(window.MAGIC_PUBLISHABLE_KEY)

diform.onsubmit = e => {
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