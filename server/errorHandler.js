export default function(fn){
  return function asyncUtilWrap(...args){
    const fnReturn = fn(...args)
    const res = args[1]
    return Promise.resolve(fnReturn).catch(data => {
      console.error(data)
      res.status(data.code || 500).send(data)
    })
  }
}