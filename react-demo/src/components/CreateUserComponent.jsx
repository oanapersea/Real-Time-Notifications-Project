import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import UserService from "../services/UserService";

class CreateUserComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            role: '',
            id: '',
            email: '',
            password: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeRoleHandler = this.changeRoleHandler.bind(this);
        this.changeIdHandler = this.changeIdHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);

    }

    async onSubmit(e) {
        e.preventDefault();
        const user = {
            name: this.state.name,
            role: this.state.role,
            id: this.state.id,
            email: this.state.email,
            password: this.state.password
        };

        console.log('Submitting user:', user);
        try {
            const response = await UserService.createUser(user);
            console.log('User created response:', response.data);
            this.props.history.push("/user", { userCreated: true });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    changeFirstNameHandler(event) {
        this.setState({ name: event.target.value });
    }

    changePasswordHandler(event) {
        this.setState({ password: event.target.value });
    }

    changeEmailHandler(event) {
        this.setState({ email: event.target.value });
    }



    changeRoleHandler(event) {
        this.setState({ role: event.target.value });
    }

    changeIdHandler(event) {
        this.setState({ id: event.target.value });
    }

    componentDidMount() {
        const userRole = localStorage.getItem('userRole');

        if (userRole !== 'admin') {
            this.props.history.push('/user/login');
            return;
        }

    }


    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center">Add User</h3>
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
                                        <label> Role : </label>
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
                                    <button type="submit" className="btn btn-success">Submit</button>
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

export default withRouter(CreateUserComponent);
