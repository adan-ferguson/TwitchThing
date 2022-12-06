import DIElement from '../../diElement.js'

const HTML = `
<div class="content-columns">
  <div class="content-well">
    <div class="supertitle">To Upgrade</div>
    <di-inventory></di-inventory>
  </div>
  <div class="content-rows displaynone">
    <di-item-full-details class="item-before"></di-item-full-details>
    <div class="down-arrow"></div>
    <di-item-full-details class="item-after"></di-item-full-details>
  </div>
  <div class="content-rows">
    <div class="content-well">
      <div class="supertitle">Components</div>
      <di-list></di-list>
    </div>
    <button class="content-no-grow" disabled>Upgrade Item</button>
  </div>
</div>
`

export default class Forge extends DIElement{
  setData(data){
    console.log(data)
    this.innerHTML = HTML
  }
}
customElements.define('di-workshop-forge', Forge)