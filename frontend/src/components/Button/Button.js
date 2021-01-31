import React from 'react'
import './Button.css'
class Button extends React.Component {
    render() {
        return <div {...this.props} className={'button'}>
            {this.props.children}
        </div>
    }
}
export default Button;