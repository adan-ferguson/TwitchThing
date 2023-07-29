import { runCombat } from '../../../server/combat/combat.js'

const args = window.COMBAT_ARGS
const btn = document.querySelector('#run-combat')

if(!args){
  btn.disabled = true
  btn.textContent = 'Combat not found'
}else{
  btn.addEventListener('click', () => {
    const time = Date.now()
    runCombat(args)
    document.querySelector('#run-time').textContent = Date.now() - time
  })
}