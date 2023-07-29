import '../components/registerForm.js'

const HTML = `
<div class='login-form center-contents'>
    <div class="autocrawl">AUTOCRAWL</div>
    <div class="subtitle">An Automated Dungeon Crawler Game Thing</div>
    <di-register-form></di-register-form>
</div>
<a class="buttonish" href="/user/newuseranonymous">
    Create account without logging in
</a>
`

const target = document.querySelector('.login-page')
target.innerHTML = HTML