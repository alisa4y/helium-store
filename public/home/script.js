import { jss, ael, onClickAway, qsa, obs, qs } from "jss"
import data from "/data.json"
import { Observable } from "object-observer"
import { xm } from "js-tools"
const { observe, from } = Observable
const orders = from([])
let userInfo = from({})
const track = []

jss({
  ".icon.menu": elm => {
    ael(elm, "click", () => {
      elm.classList.toggle("show")
    })
    ael(elm.lastChild, "click", e => e.stopImmediatePropagation())
    onClickAway(elm, () => elm.classList.remove("show"))
  },
  ".card": elm => {
    const orderBtn = elm.querySelector("button")
    ael(orderBtn, "click", () => {
      const order = data.cards.find(({ name }) => name === elm.eval.name)
      const i = orders.findIndex(({ name }) => name === order.name)
      if (i < 0) {
        orders.push({ ...order, count: 1 })
      } else orders[i].count++
    })
  },
  ".badge": elm => {
    obs(
      elm,
      () => (elm.style.display = elm.eval.count == 0 ? "none" : "initial"),
      { childList: true }
    )
    observe(
      orders,
      () => (elm.eval.count = orders.reduce((p, o) => p + o.count, 0))
    )
  },
  "t-order": elm => {
    const elmVal = elm.eval
    const order = orders.find(({ name }) => name === elmVal.name)
    const [plus, minus] = qsa("button", elm)
    ael(plus, "click", () => order.count++)
    ael(minus, "click", () => order.count--)
  },
  "#orders-list": elm => {
    observe(
      orders,
      () =>
        (elm.eval.totalPrice = distNumber(
          orders.reduce((a, o) => a + o.price, 0)
        ))
    )
    const buyBtn = qs("button.buy", elm)
    const phoneRegister = qs("#phone-register")
    ael(buyBtn, "click", () => {
      phoneRegister.classList.add("open")
    })
  },
  "#phone-register": elm => {
    const registerBtn = qs("button", elm)
    const codeConfirm = qs("#code-confirm")
    ael(registerBtn, "click", () => {
      codeConfirm.classList.add("open")
    })
  },
  "main > .open": elm => {
    const opened = qsa("main > .open").filter(e => e !== elm)[0]
    if (opened) {
      opened.classList.remove("open")
      track.push(opened)
    }
  },
  ".icon.back": elm => {
    xm(track, "push", () => {
      elm.style.opacity = 1
    })
    xm(track, "pop", () => {
      if (track.length === 0) elm.style.opacity = 0
    })
    elm.style.opacity = 0
    ael(elm, "click", () => {
      if (track.length > 0) {
        qs("main > .open").classList.remove("open")
        track.pop().classList.add("open")
      }
    })
  },
  ".icon.basket": elm => {
    const ordersList = qs("#orders-list")
    ael(elm, "click", () => {
      ordersList.classList.add("open")
    })
  },
  ".icon.avatar": elm => {
    elm.style.opacity = userInfo.name ? 1 : 0
    observe(userInfo, () => {
      elm.style.opacity = userInfo.name ? 1 : 0
    })
    const userInfoElm = qs("#user-info")
    ael(elm, "click", () => {
      userInfoElm.classList.add("open")
    })
  },
  "#user-info": elm => {
    obs(qs("#phone-register input"), value => {
      userInfo.phoneNumber = value
    })
    const orderBtnElm = qs("button", elm)
    const ordersListElm = qs("#order-history")
    ael(orderBtnElm, "click", () => {
      ordersListElm.classList.add("open")
    })
  },
})
ael(window, "load", async () => {
  const ordersElm = qs("#orders")
  observe(orders, changes => {
    changes.forEach(({ type, path: [i, prop], value, oldValue }) => {
      if (type === "update" && prop === "count") {
        if (value === 0) {
          orders.splice(i, 1)
        } else {
          const order = orders[i]
          const perPrice = order.price / oldValue
          orders[i].price = perPrice * value
        }
      }
    })
    ordersElm.eval = orders.map(order => ({
      ...order,
      price: distNumber(order.price),
    }))
  })
  fetch("/user/info")
    .then(r => r.json())
    .then(o => {
      Object.assign(userInfo, o)
    })
  const userInfoElm = qs("#user-info")
  observe(userInfo, changes => {
    userInfoElm.eval = userInfo
  })
})
function distNumber(n, split = ",") {
  return n
    .toString()
    .split("")
    .reduceRight(
      (a, ch) => {
        if (a[0].length < 3) {
          a[0] = ch + a[0]
        } else {
          a[0] = split + a[0]
          a.unshift(ch)
        }
        return a
      },
      [""]
    )
    .join("")
}
