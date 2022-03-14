import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'

(async () => {

  const magic = new Magic(window.MAGIC_PUBLISHABLE_KEY, {
    extensions: [new OAuthExtension()]
  })

  const res = await magic.oauth.getRedirectResult()
  if(!res){
    return false
  }

  const result = await fetch('/user/login', {
    headers: new Headers({
      Authorization: 'Bearer ' + res.magic.idToken
    }),
    withCredentials: true,
    credentials: 'same-origin',
    method: 'POST'
  })
  if(result.error){
    window.location = '/login'
  }else{
    window.location = '/game'
  }

})()