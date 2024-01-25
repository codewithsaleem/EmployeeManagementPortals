import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
import auth from "./httpServiceAuthEmp.js";

class Details extends Component {
    state = {
        detailForm: { manager: "", designation: "", department: "" },
        errors: {},
        errors1: "",
        successMsg: "",
        errorMsg: "",
    }

    async fetchData() {
        let { empuserid } = this.props.match.params;
        try {
            if (empuserid) {
                let response = await http.get(`/empapp/empdept/${empuserid}`);
                let { data } = response;
                this.setState({ detailForm: data })
            }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                let errors = ex.response.data;
                this.setState({ errors1: errors })
            }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) this.fetchData();
    }

    handleChange = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };
        s1.detailForm[input.name] = input.value;
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
        let { detailForm, edit } = this.state;
        let { empuserid } = this.props.history.push;
        let errors = this.validateAll();

        if (this.isValid(errors)) {
            this.postData(`/empapp/empdept/${detailForm.empuserid}`, detailForm)
        } else {
            let s1 = { ...this.state };
            s1.errors = errors;
            this.setState(s1);
        }
    }

    isValid = (errors) => {
        let keys = Object.keys(errors);
        let count = keys.reduce((acc, curr) => (errors[curr] ? acc + 1 : acc), 0)
        return count === 0;
    }

    validateAll = () => {
        let { manager, designation, department } = this.state.detailForm;
        let errors = {};
        errors.manager = this.handleManager(manager);
        errors.designation = this.handleDesignation(designation);
        errors.department = this.handleDepartment(department);
        return errors;
    }

    handleManager = (manager) => !manager ? "Required" : "";
    handleDesignation = (designation) => !designation ? "Required" : "";
    handleDepartment = (department) => !department ? "Required" : "";

    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "manager": s1.errors.manager = this.handleManager(input.value); break;
            case "designation": s1.errors.designation = this.handleDesignation(input.value); break;
            case "department": s1.errors.department = this.handleDepartment(input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    render() {
        let { manager, designation, department } = this.state.detailForm;
        let { errors, detailForm, successMsg } = this.state;
        let { errors1 = null } = this.state;
        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light mt-4">
                    <h3 className="text-center">Department Details of New Employee</h3>

                    {successMsg !== "" ? (<span className="text-success"><h4>{successMsg}</h4></span>) :
                        errors1 ? (<span className="text-danger"><h4>No Department Details Found. Please Enter them</h4></span>) :
                            (<span className="text-primary"><h4>Displaying Department Details</h4></span>)
                    }

                    <form className="mt-4">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Department: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={department}
                                    placeholder="Enter department"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.department ? (<span className="text-danger">{errors.department}</span>) : ""}
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Designation: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    value={designation}
                                    placeholder="Enter designation"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.designation ? (<span className="text-danger">{errors.designation}</span>) : ""}
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Manager's Name: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="manager"
                                    name="manager"
                                    value={manager}
                                    placeholder="Enter the Manager's Name"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.manager ? (<span className="text-danger">{errors.manager}</span>) : ""}
                        </div>

                    </form>
                    <button
                        className="btn btn-primary mt-2 mb-3"
                        onClick={this.handleSubmit}
                        disabled={
                            (errors.manager || errors.designation || errors.department) ||
                            !errors1 || successMsg
                        }
                    >
                        Submit
                    </button>


                </div>
            </div>
        )
    }
}
export default Details;