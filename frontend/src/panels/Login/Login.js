import React from 'react'
import './Login.css'
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: '',
                password: '',
            },
            checkData: {
                isUsernameNotEmpty: true,
                isPasswordNotEmpty: true,
            },
            textInfo: ''
        }
    }
    onChange = (e) => {
        const data = this.state.data;
        const checkData = this.state.checkData;
        const checkValue = "is"
            + e.target.name.charAt(0).toUpperCase()
            + e.target.name.slice(1) + "NotEmpty";
        if (!!e.target.value) checkData[checkValue] = true
        data[e.target.name] = e.target.value
        this.setState({
            data: data,
            checkData: checkData
        })
    }

    onClick = () => {
        const checkData = this.state.checkData;
        const data = this.state.data

        checkData.isUsernameNotEmpty = !!data.username
        checkData.isPasswordNotEmpty = !!data.password

        let allCheck = true

        this.setState({
            checkData: checkData
        })
        Object.keys(checkData).forEach(key => allCheck &&= checkData[key])
        if (allCheck){
            this.props.auth(data.username, data.password)
                .then(data => {
                    this.props.setToken(data.data.token)
                }).catch(e => {
                    this.setState({
                        textInfo: e.response.data.error
                    })
            })
        }
    }

    render() {
        const data = this.state.data
        return <div style={{padding: '12px'}}>
            <div className={'auth-input-elem-container'} style={{color: '#c5dce3'}}>
                {this.state.textInfo}
            </div>
            <div className={'auth-input-elem-container'}>
                <Input type={'text'}
                       name={'username'}
                       placeholder={'Email:'}
                       value={data.username}
                       onChange={this.onChange}/>
            </div>
            <div className={'auth-input-elem-container'} style={{color: '#c5dce3'}}>
                {!this.state.checkData.isUsernameNotEmpty ? 'Это поле не должно быть пустым' : null}
            </div>
            <div className={'auth-input-elem-container'}>
                <Input type={'password'}
                       placeholder={'Пароль:'}
                       name={'password'}
                       value={data.password}
                       onChange={this.onChange}/>
            </div>
            <div className={'auth-input-elem-container'} style={{color: '#c5dce3'}}>
                {!this.state.checkData.isPasswordNotEmpty ? 'Это поле не должно быть пустым' : null}
            </div>
            <div className={'auth-input-elem-container'}>
                <Button onClick={this.onClick}>
                    Авторизация
                </Button>
            </div>
        </div>
    }
}

export default Login;