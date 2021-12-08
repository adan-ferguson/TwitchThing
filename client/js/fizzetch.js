export default async function(url, data = null){
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

    const resp = await fetch(url, obj)
    return await resp.json()
  }catch(ex){
    return { error: `An error occurred during fizzetch of ${url}` }
  }
}