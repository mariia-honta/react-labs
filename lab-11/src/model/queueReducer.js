/**
 * Ред'юсер черги замовлень. Його написав колега; у нього черга працює.
 *
 * Стан: { orders: [...] }. Кожне замовлення — як у src/data/orders.js:
 *   { id, number, status, customer: { id, name }, items: [...] }
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

// Номер останнього замовлення. У стані його не тримаємо: номери лише
// ростуть, а номер скасованого замовлення новому не дістається.

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const state = {
    orders: { byId: {}, ids: [] },
    customers: { byId: {}, ids: [] },
    lastNumber: Math.max(...orders.map((order) => order.number)),
  }
  for (const { customer, ...order } of orders) {
    state.orders.byId[order.id] = { ...order, customerId: customer.id }
    state.orders.ids.push(order.id)
    if (!state.customers.byId[customer.id]) {
      state.customers.byId[customer.id] = { ...customer }
      state.customers.ids.push(customer.id)
    }
  }
  return state
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const { customer, ...placed } = action.order
      const number = state.lastNumber + 1
      const order = {
        ...placed,
        number,
        status: 'new',
        customerId: customer.id,
        items: placed.items.map((item) => ({ ...item, done: false })),
      }
      return {
        ...state,
        lastNumber: number,
        orders: {
          byId: { ...state.orders.byId, [order.id]: order },
          ids: [...state.orders.ids, order.id],
        },
        customers: {
          byId: { ...state.customers.byId, [customer.id]: customer },
          ids: [...state.customers.ids, customer.id],
        },
      }
    }
    case 'item_toggled':
      return updateOrder(state, action.orderId, (order) => ({
        ...order,
        items: order.items.map((item) =>
          item.id === action.itemId ? { ...item, done: !item.done } : item,
        ),
      }))

    case 'order_advanced':
      return updateOrder(state, action.orderId, (order) => ({
        ...order,
        status: nextStatus[order.status],
      }))

    case 'order_cancelled': {
      const byId = { ...state.orders.byId }
      delete byId[action.orderId]
      return {
        ...state,
        orders: {
          byId,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }
    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [customer.id]: { ...customer, name: action.name },
          },
        },
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function updateOrder(state, orderId, change) {
  return {
    ...state,
    orders: {
      ...state.orders,
      byId: {
        ...state.orders.byId,
        [orderId]: change(state.orders.byId[orderId]),
      },
    },
  }
}

function withCustomer(state, order) {
  return { ...order, customer: state.customers.byId[order.customerId] }
}
/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => withCustomer(state, order))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  return order && withCustomer(state, order)
}
