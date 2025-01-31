import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import UserService from "../services/UserService";

class UpdateUserComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            name: '',
            role: '',
            password: '',
            email: ''
        };

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeRoleHandler = this.changeRoleHandler.bind(this);
        this.changeIdHandler = this.changeIdHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        const userRole = localStorage.getItem('userRole');

        if (userRole !== 'admin') {
            this.props.history.push('/user/login');
            return;
        }

        UserService.getUserById(this.state.id).then((res) => {
            let user = res.data;
            this.setState({name: user.name, role: user.role, email: user.email, password: user.password})
        });

    }


    updateUser = (e) => {
        e.preventDefault();
        let user = {name : this.state.name, role: this.state.role, email : this.state.email, password : this.state.password};
        console.log('user => ' + JSON.stringify(user));

        UserService.updateUser(user, this.state.id).then(res =>{
            this.props.history.push('/user');
        })


    }

    changeFirstNameHandler(event) {
        this.setState({ name: event.target.value });
    }

    changeEmailHandler(event) {
        this.setState({ email: event.target.value });
    }

    changePasswordHandler(event) {
        this.setState({ password: event.target.value });
    }

    changeRoleHandler(event) {
        this.setState({ role: event.target.value });
    }

    changeIdHandler(event) {
        this.setState({ id: event.target.value });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center">Update User</h3>
                            <div className="card-body">
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label> First Name: </label>
                                        <input
                                            placeholder="Name"
                                            name="name"
                                            className="form-control"
                                            value={this.state.name}
                                            onChange={this.changeFirstNameHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> Role: </label>
                                        <input
                                            placeholder="Role"
                                            name="role"
                                            className="form-control"
                                            value={this.state.role}
                                            onChange={this.changeRoleHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> Email: </label>
                                        <input
                                            placeholder="Email"
                                            name="email"
                                            className="form-control"
                                            value={this.state.email}
                                            onChange={this.changeEmailHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> Password: </label>
                                        <input
                                            placeholder="Password"
                                            name="password"
                                            className="form-control"
                                            value={this.state.password}
                                            onChange={this.changePasswordHandler}
                                        />
                                    </div>
                                    <button className="btn btn-success" onClick={this.updateUser}>Save</button>
                                    <Link className="btn btn-danger" to="/user"
                                          style={{marginLeft: "10px"}}>Cancel</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdateUserComponent);
