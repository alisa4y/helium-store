import { timeout } from "js-tools"
import { jss, ael, onClickAway, ObserveElm, g_, qs } from "jss"
import data from "/data.json"

let orders
ael(window, "load", async () => {
  await timeout(0)
  const ordersElm = document.querySelector("#orders")
  orders = ordersElm.eval
  const badge = document.querySelector(".badge").eval
  ObserveElm(
    () =>
      (badge.count = orders.reduce((p, o) => p + parseInt(o.count) || 0, 0)),
    ordersElm
  )
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
    const orderBtn = elm.querySelector("button")
    ael(orderBtn, "click", () => {
      const order = elm.eval
      const i = orders.findIndex(({ name }) => name === order.name)
      if (i < 0) {
        order.count = 1
        order.price = ({ count }) =>
          parseInt(count) *
          data.cards.find(({ name }) => order.name === name).price
        orders.push(order)
      } else orders[i].count++
    })
  },
  ".badge": async elm => {
    await timeout(0)
    ObserveElm(
      () => (elm.style.display = elm.eval.count == 0 ? "none" : "initial"),
      elm
    )
  },
  "t-order": elm => {
    const inp = qs("input", elm)
    const elmVal = elm.eval
    ael(inp, "input", () => {
      let count = parseInt(elmVal.count)
      if (isNaN(count)) return
      if (count === 0) elm.remove()
      else orders.find(({ name }) => name === elmVal.name).count = count
    })
  },
  "orders-list": elm => {},
})
g_("countCard", ar => ({ count: ar.length }))
