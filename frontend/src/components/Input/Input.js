import React from 'react'
import './Input.css'
class Input extends React.Component{
    render() {
        const style = this.props.style
            ? this.props.style : {};
        const params = {...this.props}
        params.style = null
        return <div className={'input-container'}
                    style={{width: '180px', height: '48px', ...style}}>
            <input {...params}/>
        </div>
    }
}
export default Input;