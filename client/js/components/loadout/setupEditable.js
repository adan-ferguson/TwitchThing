const DRAG_THRESHOLD = 8

let draggedElement
let hoveredElement
let hoverables
let started = false
let initialPoint

/**
 * Given an inventory + loadout pair, set them up so that they can be editable:
 * - If inventory item clicked, add to loadout if loadout not full
 * - If loadout item clicked, add it back to the inventory
 * - Item can be dragged out of loadout to remove it
 * - Item can be dragged within loadout to change the slot
 * - Item can be dragged from inventory to a specific loadout slot
 * - When loadout changes, it should update its header data (orbs)
 * @param inventoryEl {Inventory}
 * @param loadoutEl {Loadout}
 * @param options {object}
 */
export default function(inventoryEl, loadoutEl, options = {}){

  options = {
    onChange: () => undefined,
    ...options
  }

  inventoryEl.classList.add('editable')
  loadoutEl.classList.add('editable')

  inventoryEl.addEventListener('click', click)
  inventoryEl.addEventListener('pointerdown', pointerdown)
  inventoryEl.addEventListener('pointermove', pointermove)
  inventoryEl.addEventListener('pointerup', pointerup)

  loadoutEl.addEventListener('click', click)
  loadoutEl.addEventListener('pointerdown', pointerdown)
  loadoutEl.addEventListener('pointermove', pointermove)
  loadoutEl.addEventListener('pointerup', pointerup)

  function click(e){
    const row = e.target.closest('di-loadout-row')
    if(row === draggedElement && started){
      return
    }
    if(inventoryEl.contains(row)){
      addToLoadout(row)
    }else{
      removeFromLoadout(row)
    }
    reset()
  }

  function pointerdown(e){
    const row = e.target.closest('di-loadout-row')
    if(!row){
      return
    }
    draggedElement = row
    hoveredElement = null
    started = false
    initialPoint = {
      x: e.clientX,
      y: e.clientY
    }
  }

  function pointermove(e){
    if(!e.buttons){
      reset()
      return
    }
    const row = e.target.closest('di-loadout-row')
    if(draggedElement !== row){
      return
    }
    if(!started){
      if(dist(initialPoint, { x: e.clientX, y: e.clientY }) >= DRAG_THRESHOLD){
        started = true
        calcHoverables()
      }
    }
    if(started){
      const currentPoint = {
        x: e.clientX - initialPoint.x,
        y: e.clientY - initialPoint.y
      }
      const hovered = getHoverableUnderPoint(currentPoint)
      if(hovered !== hoveredElement){
        if(hoveredElement){
          hoveredElement.classList.remove('hovered')
        }
        hoveredElement = hovered
        hoveredElement.classList.add('hovered')
      }
      row.style.transform = `translate(${currentPoint.x}px, ${currentPoint.y}px)`
    }
  }

  function pointerup(e){
    const row = e.target.closest('di-loadout-row')
    if(draggedElement !== row || !started){
      return
    }
    if(hoveredElement){
      if(hoveredElement === inventoryEl){
        removeFromLoadout(draggedElement)
      }else if(loadoutEl.contains(draggedElement)){
        swapLoadoutRows(draggedElement, hoveredElement)
      }else{
        if(!hoveredElement.classList.contains('blank-row')){
          removeFromLoadout(hoveredElement)
        }
        addToLoadout(draggedElement, hoveredElement)
      }
    }
    reset()
  }

  function calcHoverables(){

    if(loadoutEl.contains(draggedElement)){
      inventoryEl.classList.add('hoverable')
    }

    loadoutEl.list.itemsList.forEach(row => row.classList.add('hoverable'))
    draggedElement.classList.remove('hoverable')

    hoverables = []
    document.querySelectorAll('.hoverable').forEach(el => {
      hoverables.push({ el, rect: el.getBoundingClientRect() })
    })
  }

  function getHoverableUnderPoint(point){
    return hoverables.find(hoverable => contains(hoverable.rect, point))?.el
  }

  function addToLoadout(row, toReplace = null){

  }

  function removeFromLoadout(row){

  }

  function swapLoadoutRows(row1, row2){

  }
}

function dist(pointA, pointB){
  return Math.sqrt(Math.pow(pointA.x + pointB.x, 2) + Math.pow(pointA.y + pointB.y, 2))
}

function contains(rect, point){
  if(rect.left > point.x || rect.right < point.x || rect.top > point.y || rect.bottom < point.y){
    return false
  }
  return true
}

function reset(){
  hoverables.forEach(hoverable => {
    hoverable.el.classList.remove('hoverable', 'hovered')
  })
  hoverables = null
  if(draggedElement){
    draggedElement.style.transform = null
  }
  draggedElement = null
  hoveredElement = null
  started = false
  initialPoint = null
}