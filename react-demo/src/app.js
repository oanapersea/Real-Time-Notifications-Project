import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import Login from './Login'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import ListUserComponent from "./components/ListUserComponent";
import ListDeviceComponent from "./components/ListDeviceComponent";
import CreateUserComponent from "./components/CreateUserComponent";
import CreateDeviceComponent from "./components/CreateDeviceComponent";
import UpdateUserComponent from "./components/UpdateUserComponent";
import UpdateDeviceComponent from "./components/UpdateDeviceComponent";
import ViewUserComponent from "./components/ViewUserComponent";
import ViewDeviceComponent from "./components/ViewDeviceComponent";
import Chat from "./components/Chat";


class App extends React.Component {


    render() {

        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />
                        <Route
                            exact
                            path='/user/login'
                            render={() => <Login/>}
                        />



                        <Route
                            exact
                            path='/chat/:id'
                            render={() => <Chat/>}
                        />

                        <Route
                            exact
                            path='/chats'
                            render={() => <Chat/>}
                        />

                        <Route
                                exact
                                path='/user'
                                render={() => <ListUserComponent/>}
                        />

                        <Route
                            exact
                            path='/add-user'
                            render={() => <CreateUserComponent/>}
                        />

                        <Route
                            exact
                            path='/device'
                            render={() => <ListDeviceComponent/>}
                        />

                        <Route
                            exact
                            path='/add-device'
                            render={() => <CreateDeviceComponent/>}
                        />

                        <Route
                            exact
                            path='/update-user/:id'
                            render={() => <UpdateUserComponent/>}
                        />

                        <Route
                            exact
                            path='/update-device/:id'
                            render={() => <UpdateDeviceComponent/>}
                        />

                        <Route
                            exact
                            path='/view-user/:id'
                            render={() => <ViewUserComponent/>}
                        />



                        <Route
                            exact
                            path='/view-device/:id'
                            render={() => <ViewDeviceComponent/>}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
