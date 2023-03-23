const DRAG_THRESHOLD = 12

let draggedElement
let hoveredElement
let hoverables
let dragStarted = false
let initialPoint

/**
 * Given an inventory + loadout pair, set them up so that they can be editable:
 * - If inventory item clicked, add to loadout if loadout not full
 * - If loadout item clicked, add it back to the inventory
 * - Item can be dragged out of loadout to remove it
 * - Item can be dragged within loadout to change the slot
 * - Item can be dragged from inventory to a specific loadout slot
 * - When loadout changes, it should update its header data (orbs)
 * @param inventoryEl {List}
 * @param loadoutEl {DIElement}
 * @param options {object}
 */
export default function(inventoryEl, loadoutEl, options){

  options = {
    suggestChange: null,
    rowSelector: null,
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

  function isChangeable(row){
    if(row.classList.contains('blank')){
      return false
    }
    return true
  }

  function click(e){
    const row = e.target.closest(options.rowSelector)
    if(!isChangeable(row) || dragStarted){
      return
    }
    if(inventoryEl.contains(row)){
      options.suggestChange({
        type: 'add',
        row
      })
    }else{
      options.suggestChange({
        type: 'remove',
        row
      })
    }
  }

  function pointerdown(e){
    const row = e.target.closest(options.rowSelector)
    if(!isChangeable(row) || row.classList.contains('filtered')){
      return
    }
    draggedElement = row
    hoveredElement = null
    dragStarted = false
    row.setPointerCapture(e.pointerId)
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
    const row = e.target.closest(options.rowSelector)
    if(!draggedElement || draggedElement !== row){
      return
    }
    if(!dragStarted){
      if(dist(initialPoint, { x: e.clientX, y: e.clientY }) >= DRAG_THRESHOLD){
        dragStarted = true
        calcHoverables()
      }
    }
    if(dragStarted){
      const currentPoint = {
        x: e.clientX,
        y: e.clientY
      }
      const hovered = getHoverableUnderPoint(currentPoint)
      if(hovered !== hoveredElement){
        hoveredElement?.classList.remove('hovered')
        hovered?.classList.add('hovered')
        hoveredElement = hovered
      }
      draggedElement.style.zIndex = 1000
      draggedElement.style.transform = `translate(${currentPoint.x - initialPoint.x}px, ${currentPoint.y - initialPoint.y}px)`
    }
  }

  function pointerup(e){
    const row = e.target.closest(options.rowSelector)
    if(draggedElement !== row || !dragStarted){
      return
    }
    if(hoveredElement){
      if(hoveredElement === inventoryEl){
        options.suggestChange({
          type: 'remove',
          row
        })
      }else if(loadoutEl.contains(draggedElement)){
        options.suggestChange({
          type: 'swap',
          row,
          row2: hoveredElement
        })
      }else{
        options.suggestChange({
          type: 'add',
          row,
          row2: hoveredElement
        })
      }
    }
    reset()
  }

  function calcHoverables(){

    if(loadoutEl.contains(draggedElement)){
      inventoryEl.classList.add('hoverable')
    }

    [...loadoutEl.children].forEach(row => row.classList.add('hoverable'))
    draggedElement.classList.remove('hoverable')

    hoverables = []
    document.querySelectorAll('.hoverable').forEach(el => {
      hoverables.push({ el, rect: el.getBoundingClientRect() })
    })
  }

  function getHoverableUnderPoint(point){
    return hoverables.find(hoverable => contains(hoverable.rect, point))?.el
  }
}

function dist(pointA, pointB){
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2))
}

function contains(rect, point){
  const vhSize = window.innerHeight / 100
  const padding = vhSize / 2
  if(rect.left > point.x || rect.right < point.x || rect.top - padding > point.y || rect.bottom + padding < point.y){
    return false
  }
  return true
}

function reset(){
  if(hoverables){
    hoverables.forEach(hoverable => {
      hoverable.el.classList.remove('hoverable', 'hovered')
    })
    hoverables = null
  }
  if(draggedElement){
    draggedElement.style.transform = 'initial'
    draggedElement.style.zIndex = 'initial'
    draggedElement = null
  }
  hoveredElement = null
  initialPoint = null
}