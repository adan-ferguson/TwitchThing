import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import DIForm from './form.js'
import fizzetch from '../fizzetch.js'

const LINK_EXISTING_HTML = `
<p style="text-align:center">Link this account to an email address so it doesn't disappear forever if you get logged out or something.</p>
`

const HTML = linkExisting => `
${linkExisting ? LINK_EXISTING_HTML : ''}
<div class='email-login-form'></div>
<div class="oauth-providers ${linkExisting ? 'displaynone' : ''}">
    Or ${linkExisting ? 'signup' : 'login'} with:
    <div class="providers-list">
        <button provider="google">
            <img alt="Login with Google" src="../../assets/google.png"/>
        </button>
        <button provider="twitch">
            <i class="fa-brands fa-twitch"></i>
        </button>
        <button provider="discord">
            <i class="fa-brands fa-discord"></i>
        </button>
    </div>
</div>
`

export default class RegisterForm extends HTMLElement{
  constructor(options = {}){
    super()
    const linkExisting = options.linkExisting
    this.innerHTML = HTML(linkExisting)

    const magic = new Magic(window.MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()]
    })

    const diform = new DIForm({
      submitText: linkExisting ? 'Signup' : 'Login / Signup',
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

    this.querySelector('.email-login-form').appendChild(diform)
    this.querySelectorAll('.providers-list button').forEach(
      el => {
        el.addEventListener('click', e => {
          const provider = el.getAttribute('provider')
          if (provider){
            handleOAuthLogin(provider)
          }
        })
      })

    async function sendLink(){
      const email = diform.data().email
      if(linkExisting){
        const exists = await fizzetch('/user/emailexists', { email })
        if(exists){
          return { error: 'Email is already linked to an account.' }
        }
      }

      const didToken = await magic.auth.loginWithMagicLink({ email })
      const result = await fetch('/user/' + (linkExisting ? 'linkexisting' : 'login'), {
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
      if(linkExisting){
        return
      }
      magic.oauth.loginWithRedirect({
        provider,
        redirectURI: window.location.origin + '/oauthredirect'
      })
    }
  }
}
customElements.define('di-register-form', RegisterForm)