export default function(scaling){
  if(!scaling){
    throw 'Scaling not defined for gainHealthAction'
  }
  return {
    scaling,
    type: 'gainHealth'
  }
}