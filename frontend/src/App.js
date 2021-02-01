import React from 'react'
import './App.css';
import {Redirect, Route, Switch} from "react-router";
import Auth from "./panels/Auth/Auth";
import Main from "./panels/Main/Main";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Briefcase from "./panels/Briefcase/Briefcase";
import axios from "./api";
import cookie from "react-cookies";
import Settings from "./panels/Settings/Settings";

class App extends React.Component {
    constructor(props) {
        super(props);
        const token = cookie.load('token')
        if (token) {
            this.setState({token: token})
            cookie.save('token', token, {maxAge: 30 * 24 * 60 * 60, path: '/'})
        }
        this.state = {
            token: token,
            loading: true,
            links: [
                {
                    title: 'Главная',
                    link: '/main',
                    type: 'public',
                },
                {
                    title: 'Портфель',
                    link: '/briefcase',
                    type: 'private',
                },
                {
                   title: 'Настройки',
                   link: '/settings',
                   type: 'private',
                },
            ],
            currentLink: 'Портфель'
        }
    }

    auth = (login, password) => {
        return axios.post('/auth/',
            {
                username: login,
                password: password,
            }, {
                headers: {
                    "X-CSRFTOKEN": cookie.load("csrftoken")
                }
            })
    }

    register = (data) => {
        return axios.put('/auth/',
            data, {
                headers: {
                    "X-CSRFTOKEN": cookie.load("csrftoken")
                }
            })
    }

    setToken = (token) => {
        window.open(`/briefcase`, "_self");
        cookie.save('token', token, {maxAge: 30 * 24 * 60 * 60, path: '/'})
    }

    logOut = () => {
        cookie.remove('token', {path: '/'})
        this.setState({
            token: null,
            loading: true,
        })
        window.open(`/auth`, "_self");
    }

    getBriefcase = () => {
        return axios.get('/briefcase/',
            {
                headers: {
                    Authorization: 'Token ' + this.state.token,
                    "X-CSRFTOKEN": cookie.load("csrftoken")
                }
            })
    }

    getMyHistory = (financial_code) => {
        return axios.get(`/deals/?financial_code=${financial_code}`,
            {
                headers: {
                    Authorization: 'Token ' + this.state.token,
                    "X-CSRFTOKEN": cookie.load("csrftoken")
                }
            })
    }

    fileUpload = (file) => {
        let form_data = new FormData();
        form_data.append('file', file, file.name);
        return axios.post('/upload_file/', form_data, {
            headers: {
                Authorization: 'Token ' + this.state.token,
                'content-type': 'multipart/form-data'
            }
        })
    }

    componentDidMount() {

    }

    render() {
        return <Switch>
            <Route exact path='/'>
                <Main
                    user={this.state.user}
                    links={this.state.links}
                    logOut={this.logOut}
                />
            </Route>
            <Route exact path='/auth'>
                {this.state.token ? <Redirect to="/briefcase"/> :
                    <Auth
                        auth={this.auth}
                        register={this.register}
                        setToken={this.setToken}
                    />
                }
            </Route>
            <PrivateRoute exact path={'/briefcase'}
                          token={this.state.token}>
                <Briefcase
                    getBriefcase={this.getBriefcase}
                    getMyHistory={this.getMyHistory}
                    links={this.state.links}
                    logOut={this.logOut}
                />
            </PrivateRoute>
            <PrivateRoute exact path={'/settings'}
                          token={this.state.token}>
                <Settings
                    fileUpload={this.fileUpload}
                    links={this.state.links}
                    logOut={this.logOut}
                />
            </PrivateRoute>
        </Switch>
    }
}

export default App;
