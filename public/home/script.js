import { oKeys, timeout } from "js-tools"
import { jss, ael, onClickAway, ObserveElm, g_, qs } from "jss"
import { Observable } from "object-observer"

const { from, observe } = Observable
const orders = from([])

function initializeOrdering() {
  const ordersElm = qs("#orders")
  const basket = qs(".badge")
  observe(orders, () => {
    basket.eval = { count: orders.length }
    let ordersby = {}
    for (let order of orders) {
      let { name } = order
      ordersby[name] ??= []
      ordersby[name].push(order)
    }
    ordersElm.eval = oKeys(ordersby).map(name => ({
      name,
      price: ordersby[name][0].price * ordersby[name].length,
      count: ordersby[name].length,
    }))
  })
}

function hideBadge(badge) {
  if (badge.eval.count == 0) {
    badge.style.display = "none"
  }
}
ael(window, "load", async () => {
  initializeOrdering()
})

jss({
  ".icon.menu": elm => {
    ael(elm, "click", () => {
      elm.classList.toggle("open")
    })
    ael(elm.lastChild, "click", e => e.stopImmediatePropagation())
    onClickAway(elm, () => elm.classList.remove("open"))
  },
  ".card": elm => {
    const order = elm.querySelector("button")
    ael(order, "click", () => {
      orders.push(elm.eval)
    })
  },
  ".badge": async elm => {
    await timeout(0)
    hideBadge(elm)
    ObserveElm(
      () => (elm.style.display = elm.eval.count == 0 ? "none" : "initial"),
      elm
    )
  },
})
g_("countCard", ar => ({ count: ar.length }))
