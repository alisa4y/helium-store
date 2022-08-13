import { oKeys, timeout } from "js-tools"
import { jss, ael, onClickAway, ObserveElm, g_, qs } from "jss"
import { Observable } from "object-observer"

const { from, observe } = Observable
const orders = from({})

function initializeOrdering() {
  const ordersElm = qs("#orders")
  const basket = qs(".badge")
  observe(orders, ({ type, path: [name] }) => {
    basket.eval = { count: orders.reduce((a, o) => a + o.count, 0) }
    ordersElm.eval = oKeys(orders).map(name => ({
      name,
      price: orders[name][0].price * orders[name].length,
      count: orders[name].length,
    }))
  })
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
  "t-order": elm => {
    const inp = qs("input", elm)
    ael(inp, "input", () => {
      let count = parseInt(inp.eval.count)
      if (isNaN(count)) return
      let currentCount = orders.filter(
        order => order.name == elm.eval.name
      ).length
      if (count > currentCount) {
        orders.push(elm.eval)
      } else if (count < currentCount) {
        orders.splice(
          orders.findIndex(order => order.name == elm.eval.name),
          1
        )
      }
    })
  },
})
g_("countCard", ar => ({ count: ar.length }))
