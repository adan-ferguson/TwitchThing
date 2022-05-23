export default async function(url, data = null){
  let resp
  let text
  try {
    const obj = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if(data){
      obj.body = JSON.stringify(data)
    }

    resp = await fetch(url, obj)
    text = await resp.text()
    return JSON.parse(text)
  }catch(ex){
    if(!resp || resp.status >= 400){
      if(text){
        return { error: text }
      }
      return { error: ex || `An error occurred during fizzetch of ${url}` }
    }
    return {}
  }
}