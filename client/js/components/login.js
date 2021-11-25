const HTML = (twitchLoginLink) => `
<div class='widget'>
    <div class='description'>Login or signup with a service provider or with your email address.</div>
    <hr/>
    <a class='twitch-login-link' class='twitch-button' href=${twitchLoginLink} rel="noreferrer">
      <i class='fab fa-twitch'/> 'Login / Signup with Twitch'
    </a>
    <hr/>
    <div class='input-group'>
        <input type='text' placeholder='Email Address'/>
        <button>Send Login Link</button>
    </div>
</div>
`

export default class Login extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = HTML
  }
}

customElements.define('di-login', Login)