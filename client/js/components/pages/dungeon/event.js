const innerHTML = `
<div class="message"></div>
<div class="rewards"></div>
`

const REWARD_TYPES = {
  xp: {
    type: 'integer'
  }
}

export default class Event extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  update(dungeonEvent){
    if(!dungeonEvent){
      return
    }
    this.classList.add('fade-out')
    setTimeout(() => {
      this.classList.remove('fade-out')
      this.querySelector('.message').textContent = dungeonEvent.message
      this._addRewards(dungeonEvent.rewards)
    }, 400)
  }

  _addRewards(rewards){
    const rewardsEl = this.querySelector('.rewards')
    let html = ''
    for(let key in rewards){
      const rewardType = REWARD_TYPES[key]
      if(rewardType){
        html += `<div>+${rewards[key]} xp</div>`
      }
    }
    rewardsEl.innerHTML = html
  }
}

customElements.define('di-dungeon-event', Event)