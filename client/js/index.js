import { write } from './something'
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
    return (
        <div>
            <div>Welcome to my-webpack-react-starter</div>
        </div>
    )
}

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

ReactDOM.render(<App />, root)

write()