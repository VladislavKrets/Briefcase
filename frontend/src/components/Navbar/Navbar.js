import React from 'react'
import './Navbar.css'
import {Link} from "react-router-dom";
import Alert from "../Alert/Alert";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExitDialogOpened: false,
            price: null
        }
    }

    changeExitDialogState = () => {
        this.setState({
            isExitDialogOpened: !this.state.isExitDialogOpened
        })
    }

    componentDidMount() {
        this.props.getTotalPrice().then(data => {
            this.setState({
                price: data.data[0]
            })
        })
    }

    render() {
        return <>
            {this.state.isExitDialogOpened && <Alert onClose={this.changeExitDialogState}>
                <div style={{
                    width: '300px',
                    borderRadius: '12px',
                    backgroundColor: '#c5dce3',
                    color: '#1e6d87',
                }}>
                    <div style={{padding: '17px 7px', fontWeight: 'bold', textAlign: 'center'}}>
                        Вы уверены, что хотите выйти?
                    </div>
                    <div style={{display: 'flex', borderTop: '1px solid #1e6d87'}}>
                        <div style={{
                            width: '50%',
                            textAlign: 'center',
                            padding: '10px',
                            color: '#1e6d87',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            borderRight: '1px solid #1e6d87'
                        }} onClick={this.changeExitDialogState}>
                            Отмена
                        </div>
                        <div style={{
                            width: '50%',
                            textAlign: 'center',
                            color: '#D84529',
                            padding: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }} onClick={this.props.logOut}>
                            Выйти
                        </div>
                    </div>
                </div>
            </Alert>}
            <div className={'desktop-navbar'}>
                <div style={{
                    color: '#c5dce3',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    paddingLeft: '10px',
                    width: '25%',
                    minWidth: '25%',
                }}>Остаток: {this.state.price ? Math.ceil(this.state.price.total_price * 100) / 100 : 0} руб.
                </div>
                <div style={{display: 'flex', justifyContent: 'center', width: '50%', minWidth: '50%'}}>
                    {this.props.links.map(item => <Link to={item.link}>
                        {item.title}
                    </Link>)}
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    width: '25%',
                    minWidth: '25%',
                    boxSizing: 'border-box',
                    paddingRight: '10px',
                }}><a style={{cursor: 'pointer'}} onClick={this.changeExitDialogState}>Выйти</a></div>
            </div>
            <div className={'navbar-container'}>
                {this.props.children}
            </div>
        </>
    }
}

export default Navbar