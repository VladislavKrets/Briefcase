import React from 'react'

class Alert extends React.Component{

    componentDidMount() {
        document.body.style.overflow = 'hidden'
    }

    componentWillUnmount() {
        document.body.style.overflow = null
    }

    render() {
        return <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            backgroundColor: 'rgba(19, 36, 62, 0.67)'
        }} onClick={this.props.onClose}>
            <div onClick={e => e.stopPropagation()}>
                {this.props.children}
            </div>
        </div>
    }
}
export default Alert