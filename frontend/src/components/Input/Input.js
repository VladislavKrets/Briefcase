import React from 'react'
import './Input.css'
class Input extends React.Component{
    render() {
        const style = this.props.style
            ? this.props.style : {};
        const params = {...this.props}
        params.style = null
        return <div className={'input-container'}
                    style={{...style}}>
            <input autoComplete={'off'} {...params}/>
        </div>
    }
}
export default Input;