export async function post(url, data){
  const resp = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  try {
    return await resp.json()
  }catch(e){
    return resp
  }
}