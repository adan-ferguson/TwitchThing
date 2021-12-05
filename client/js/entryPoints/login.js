import { Magic } from 'magic-sdk'
import DIForm from '../components/form.js'

const diform = new DIForm({
  submitText: 'Login / Signup',
  async: true,
  action: sendLink,
  success: () => window.location = '/game'
})

diform.addInput({
  type: 'email',
  name: 'email',
  required: 'required',
  placeholder: 'Enter your e-mail address'
})

document.querySelector('.login-form').appendChild(diform)

const magic = new Magic(window.MAGIC_PUBLISHABLE_KEY)

async function sendLink(){
  const email = diform.data().email
  const didToken = await magic.auth.loginWithMagicLink({ email })
  const result = await fetch('/user/login', {
    headers: new Headers({
      Authorization: 'Bearer ' + didToken
    }),
    withCredentials: true,
    credentials: 'same-origin',
    method: 'POST'
  })
  debugger
  return { error: result.error }
}