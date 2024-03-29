const Request = require("./request");
const request = new Request();

async function scheduler() {
  console.log('starting in...', new Date().toISOString())

  const urls = [
    { url: 'https://www.mercadobitcoin.net/api/BTC/ticker/' },
    { url: 'https://www.NAOEXISTE.net' },
    { url: 'https://www.mercadobitcoin.net/api/BTC/orderbook/' }
  ]
    .map(data => ({
      ...data,
      timeout: 2000,
      method: 'get'
    }))
    .map(params => request.makeRequest(params))

  const result = await Promise.allSettled(urls)

  const allSucceded = []
  const allFailed = []

  for (const { status, value, reason } of result) {
    if (status === 'rejected') {
      allFailed.push(reason)
      continue;
    }

    allSucceded.push(value)
  }

  console.log({
    allFailed,
    allSucceded
  })
}

const PERIOD = 2000
setInterval(scheduler, PERIOD)