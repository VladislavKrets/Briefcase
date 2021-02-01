import React from 'react'
import './Navbar.css'
import {Link} from "react-router-dom";
import Alert from "../Alert/Alert";

class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isExitDialogOpened: false
        }
    }

    changeExitDialogState = () => {
        this.setState({
            isExitDialogOpened: !this.state.isExitDialogOpened
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
                <div></div>
                <div style={{display: 'flex'}}>
                    {this.props.links.map(item => <Link to={item.link}>
                        {item.title}
                    </Link>)}
                </div>
                <a style={{cursor: 'pointer'}} onClick={this.changeExitDialogState}>Выйти</a>
            </div>
            <div className={'navbar-container'}>
                {this.props.children}
            </div>
        </>
    }
}
export default Navbar