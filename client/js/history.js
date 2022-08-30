export function addPageToHistory(page, replace){
  if(page.path === null){
    return
  }
  debugger
  const targetPath = '/game' + page.path
  if(replace || targetPath === window.location.pathname){
    console.log('replace')
    window.history.replaceState({ targetPath }, '', targetPath)
  }else{
    window.history.pushState({ targetPath }, '', targetPath)
  }
}