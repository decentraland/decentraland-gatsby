import ReactDOM from 'react-dom'
ReactDOM.createPortal = ((node) => node) as typeof ReactDOM.createPortal
