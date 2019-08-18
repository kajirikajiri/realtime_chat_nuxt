const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const N = 20
const randomNo = () =>
  Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('')
export default randomNo
