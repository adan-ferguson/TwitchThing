import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import DIForm from '../components/form.js'
import LiveDungeonMap from '../components/liveDungeonMap.js'
import { connect } from '../socketClient.js'

(async () => {

  connect()

  const magic = new Magic(window.MAGIC_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()]
  })

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

  document.querySelector('.email-login-form').appendChild(diform)
  document.querySelectorAll('.providers-list button').forEach(
    el => {
      el.addEventListener('click', e => {
        const provider = el.getAttribute('provider')
        if (provider){
          handleOAuthLogin(provider)
        }
      })
    })

  const map = new LiveDungeonMap()
  document.querySelector('.dungeon-map').appendChild(map)
  map.load()

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
    return { error: result.error }
  }

  async function handleOAuthLogin(provider){
    magic.oauth.loginWithRedirect({
      provider,
      redirectURI: window.location.origin + '/oauthredirect'
    })
  }

})()