import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
import auth from "./httpServiceAuthEmp.js";

class Login extends Component {
    state = {
        empForm: { email: "", password: "" },
        errors1: {},
    }

    handleChange = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };
        s1.empForm[input.name] = input.value;
        this.setState(s1);
    }

    async login(url, obj) {
        try {
            let response = await http.post(url, obj);
            let { data } = response;
            console.log("Data from response:", data);
            auth.login(data);
            // this.props.history.push("/admin");
            if (data.role === 'ADMIN') {
                window.location = "/admin";
            } else {
                window.location = "/emp";
            }
        }
        catch (ex) {
            if (ex.response && ex.response.status === 401) {
                let errors = {};
                errors.email = ex.response.data;
                this.setState({ errors: errors });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let error = this.validateAll();

        if (this.isValid(error)) {
            this.login("/empapp/loginuser", this.state.empForm);
        } else {
            let s1 = { ...this.state };
            s1.errors1 = error;
            this.setState(s1);
        }
    }

    handleValidate = () => {
        let error = this.validateAll();
        return this.isValid(error);
    }

    isValid = (error) => {
        let keys = Object.keys(error);
        let count = keys.reduce((acc, curr) => (error[curr] ? acc + 1 : acc), 0);
        return count === 0;
    }

    validateAll = () => {
        let { email, password } = this.state.empForm;
        let errors = {};
        errors.email = this.handleEmail(email);
        errors.password = this.handlePassword(password);
        return errors;
    }

    handleEmail = (email) => !email ? "Required" : "";
    handlePassword = (password) => !password ? "Required" : "";

    render() {
        let { email, password } = this.state.empForm;
        let { errors1 } = this.state;
        let { errors = null } = this.state;

        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light">
                    <h3 className="text-center">Login</h3>
                    {errors && errors.email && <span className="text-danger">{errors.email}</span>}
                    <form className="mt-3">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Emial ID: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Enter your Email ID"
                                    onChange={this.handleChange}
                                />
                                {/* {errors1.email ? <span className="text-danger">{errors1.email}</span> : ""} */}
                            </div>
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Password: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Enter your Password"
                                    onChange={this.handleChange}
                                />
                                {/* {errors1.password ? <span className="text-danger">{errors1.password}</span> : ""} */}
                            </div>
                        </div>

                    </form>
                    <button className="btn btn-primary mt-2 mb-3" onClick={this.handleSubmit} disabled={!this.handleValidate()}>Submit</button>
                </div>
            </div>
        )
    }
}
export default Login;