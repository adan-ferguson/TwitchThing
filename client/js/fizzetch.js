export default async function(url, data = null){
  let resp
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
    return await resp.json()
  }catch(ex){
    if(!resp || resp.status >= 400){
      return { error: `An error occurred during fizzetch of ${url}` }
    }
    return {}
  }
}