import React from 'react'
import './Register.css'
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: '',
                password: '',
                repeatedPassword: ''
            },
            checkData: {
                isUsernameNotEmpty: true,
                isPasswordNotEmpty: true,
                isRepeatedPasswordNotEmpty: true,
                arePasswordsEqual: true,
                isEmailRight: true
            },
            textInfo: '',
        }
    }

    onChange = (e) => {
        const data = this.state.data;
        const checkData = this.state.checkData;
        const checkValue = "is"
            + e.target.name.charAt(0).toUpperCase()
            + e.target.name.slice(1) + "NotEmpty";
        if (!!e.target.value) checkData[checkValue] = true
        if (e.target.name === 'repeatedPassword')
            checkData.arePasswordsEqual = !e.target.value
                || (e.target.value === data.password)
        if (e.target.name === 'username')
            checkData.isEmailRight = !e.target.value
                || e.target.value.match(/\w+\.?\w*@\w+\.\w+/)
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
        checkData.isRepeatedPasswordNotEmpty =!!data.repeatedPassword

        let allCheck = true
        Object.keys(checkData).forEach(key => allCheck &&= checkData[key])
        this.setState({
            checkData: checkData
        })
        if (allCheck){
            this.props.register({username: data.username, password: data.password})
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
                {!this.state.checkData.isEmailRight ? 'Невалидный email' :
                    !this.state.checkData.isUsernameNotEmpty ? 'Это поле не должно быть пустым' :
                    null }
            </div>
            <div className={'auth-input-elem-container'}>
                <Input type={'password'}
                       name={'password'}
                       placeholder={'Пароль:'}
                       value={data.password}
                       onChange={this.onChange}/>
            </div>
            <div className={'auth-input-elem-container'} style={{color: '#c5dce3'}}>
                {!this.state.checkData.isPasswordNotEmpty ? 'Это поле не должно быть пустым' : null}
            </div>
            <div className={'auth-input-elem-container'}>
                <Input type={'password'}
                       name={'repeatedPassword'}
                       placeholder={'Повторите пароль:'}
                       value={data.repeatedPassword}
                       onChange={this.onChange}/>
            </div>
            <div className={'auth-input-elem-container'} style={{color: '#c5dce3'}}>
                {!this.state.checkData.arePasswordsEqual ? 'Пароли должны совпадать'
                    : !this.state.checkData.isRepeatedPasswordNotEmpty
                    ? 'Это поле не должно быть пустым'
                    : null}
            </div>
            <div className={'auth-input-elem-container'}>
                <Button onClick={this.onClick}>
                    Регистрация
                </Button>
            </div>
        </div>
    }
}

export default Register;