import ReactDOM from 'react-dom/client'
import React, { StrictMode } from 'react'
import App from './components/app/App'
import store from './store'
import './styles.css'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
