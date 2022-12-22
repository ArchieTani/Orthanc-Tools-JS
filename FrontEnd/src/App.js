import React, { Component } from 'react'

import Authentication from './components/Authentication'

import { login, logout } from './actions/login'
import { connect } from 'react-redux'
import apis from './services/apis'

//CSS Boostrap
import 'bootstrap/dist/css/bootstrap.min.css'
//CSS Toastify
import 'react-toastify/dist/ReactToastify.css'
//Custom CSS
import './assets/styles/orthancToolsJs.scss'
import { BrowserRouter } from 'react-router-dom'
import MainRoot from './components/Main/MainRoot'
import { toast, ToastContainer } from 'react-toastify'

// Configuring Toastify params that will be used all over the app


class App extends Component {

    login = (token, backendData) => {
        this.props.login(token, backendData)
    }

    logout = async () => {
        this.props.logout() //empty all reducer
        await apis.authentication.logOut() //ask backend to reset cookie http only
    }


    render() {
        return (
            <BrowserRouter>
                <div hidden>
                <ToastContainer
                    position={'top-right'}
                    autoClose={5000}
                    newestOnTop
                />
                </div>
                {this.props.username ?
                    <MainRoot onLogout={this.logout} username={this.props.username} roles={this.props.roles} />
                    :
                    <Authentication onLogin={this.login} />}
            </BrowserRouter>
        );
    }
}


const mapsDispatchToProps = {
    logout,
    login
}

const mapStateToProps = (state) => {
    return {
        username: state.OrthancTools.username,
        roles: state.OrthancTools.roles
    }
}

export default connect(mapStateToProps, mapsDispatchToProps)(App)

