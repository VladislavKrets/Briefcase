import React from 'react'
import './Auth.css'
import Login from "../Login/Login";
import Register from "../Register/Register";

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'login'
        }
    }

    render() {
        const authTypeChosenStyle = {
            color: '#1e6d87',
            backgroundColor: '#70AEC3',
            borderRight: this.state.type === 'login' ? '1px solid #51A7C3' : null,
            borderTopLeftRadius: this.state.type === 'login' ? '12px' : null,
            borderTopRightRadius: this.state.type === 'register' ? '12px' : null
        }
        return <div className={'auth-main-background'}>
            <div className={'auth-container'}>
                <div style={{display: 'flex',}}>
                    <div className={'auth-type-choose'}
                         style={this.state.type === 'login' ? authTypeChosenStyle
                             : {borderRight: '1px solid #70AEC3', }}
                         onClick={() => this.setState({type: 'login'})}>
                        Авторизация
                    </div>
                    <div className={'auth-type-choose'} style={this.state.type === 'register'
                        ? authTypeChosenStyle : null}
                         onClick={() => this.setState({type: 'register'})}>
                        Регистрация
                    </div>
                </div>
                <div className={'auth-title'}>
                    {
                        this.state.type === 'login' ? 'Авторизация' : 'Регистрация'
                    }
                </div>
                {
                    this.state.type === 'login' ? <Login
                        auth={this.props.auth}
                        setToken={this.props.setToken}
                    /> : <Register
                        setToken={this.props.setToken}
                        register={this.props.register}
                    />
                }
            </div>
        </div>
    }
}

export default Auth;