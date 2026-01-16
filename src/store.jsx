// import { legacy_createStore as createStore } from 'redux'

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store


import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: JSON.parse(localStorage.getItem('sidebarShow')) ?? true,
  theme: localStorage.getItem('theme') || 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      const newState = { ...state, ...rest }
      // Lưu trạng thái vào localStorage
      if (rest.sidebarShow !== undefined) {
        localStorage.setItem('sidebarShow', JSON.stringify(rest.sidebarShow))
      }
      if (rest.theme) {
        localStorage.setItem('theme', rest.theme)
      }
      return newState
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
