import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
import auth from "./httpServiceAuthEmp.js";

class Add extends Component {
    state = {
        empForm: { name: "", email: "", password: "", confirmPassword: "" },
        errors: {},
        successMsg: "",
        errorMsg: "",
    }

    handleChange = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };
        s1.empForm[input.name] = input.value;
        this.handleFocusValidation(e);
        this.setState(s1);
    }

    async postData(url, obj) {
        try {
            let response = await http.post(url, obj);
            let { data } = response;
            this.setState({ successMsg: data })
            // this.props.history.push("/admin/View Employees");
        }
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                this.setState({ errorMsg: ex.response.data });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = this.validateAll();
        if (this.isValid(errors)) {
            // Check if password and password confirmation match
            if (this.state.empForm.password !== this.state.empForm.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            } else {
                this.postData("/empapp/emps", this.state.empForm);
            }
        } else {
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    }

    isValid = (error) => {
        let keys = Object.keys(error);
        let count = keys.reduce((acc, curr) => (error[curr] ? acc + 1 : acc), 0);
        return count === 0;
    }

    validateAll = () => {
        let { name, email, password, confirmPassword } = this.state.empForm;
        let errors = {};
        errors.name = this.handleName(name);
        errors.email = this.handleEmail(email);
        errors.password = this.handlePassword(password);
        errors.confirmPassword = this.handleConfirmPassword(password, confirmPassword);
        return errors;
    }

    handleName = (name) => !name ? "Required" : name.length < 8 ? "Name should have at least 8 characters" : "";
    handleEmail = (email) => !email ? "Required" : !email.includes('@') ? "Not a valid Email" : "";
    handlePassword = (password) => !password ? "Required" :
        password.length < 8 ||
            (!/[A-Z]/.test(password)) ||
            (!/[a-z]/.test(password)) ||
            (!/[0-9]/.test(password)) ?
            "Password should be Minimum 8 characters with a lowercase, uppercase, and digit" : "";
    handleConfirmPassword = (password, confirmPassword) => password !== confirmPassword ? "Passwords do not match" : "";


    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "name": s1.errors.name = this.handleName(input.value); break;
            case "email": s1.errors.email = this.handleEmail(input.value); break;
            case "password": s1.errors.password = this.handlePassword(input.value); break;
            case "confirmPassword": s1.errors.confirmPassword = this.handleConfirmPassword(s1.empForm.password, input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    render() {
        let { name, email, password, confirmPassword } = this.state.empForm;
        let { errors, successMsg, errorMsg } = this.state;

        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light mt-4">
                    <h3 className="text-center">Add New Employee</h3>
                    {successMsg !== "" ? (<span className="text-success"><h4>{successMsg}</h4></span>) :
                        (<span className="text-danger"><h4>{errorMsg}</h4></span>)
                    }

                    <form className="mt-4">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Name: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    placeholder="Enter your name"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.name ? (<span className="text-danger">{errors.name}</span>) : ""}
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Emial: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Enter your Email ID"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.email ? (<span className="text-danger">{errors.email}</span>) : ""}
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
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.password ? (<span className="text-danger">{errors.password}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-6"></div>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Re-Enter your Password"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.confirmPassword ? (<span className="text-danger">{errors.confirmPassword}</span>) : ""}
                        </div>

                    </form>
                    <button className="btn btn-primary mt-2 mb-3" onClick={this.handleSubmit} 
                    disabled={(errors.name || errors.email || errors.password || errors.confirmPassword || successMsg)}>Add</button>
                </div>
            </div>
        )
    }
}
export default Add;