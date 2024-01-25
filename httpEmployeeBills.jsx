import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
import auth from "./httpServiceAuthEmp.js";

class Bills extends Component {
    state = {
        emp: [],
        view: -1,
        errors: {},
        successMsg: "",
        errorMsg: "",
        newForm: { description: "", expensetype: "", amount: "" },
    }

    async fetchData() {
        let { empuserid } = this.props.match.params;
        let response = await http.get(`/empapp/empbills/${empuserid}`);
        let { data, pageInfo } = response.data;
        this.setState({ emp: data, pageJSON: pageInfo })
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) this.fetchData();
    }

    handleNewForm = () => {
        let s1 = { ...this.state };
        s1.newForm = { description: "", expensetype: "", amount: "" };
        s1.view = 1;
        s1.successMsg= "";
        this.setState(s1);
    }

    handleChange = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };
        s1.newForm[input.name] = input.value;
        this.handleFocusValidation(e);
        this.setState(s1);
    }

    async postData(url, obj) {
        try {
            let response = await http.post(url, obj);
            let { data } = response;
            this.setState({ successMsg: data })
        }
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                this.setState({ errorMsg: ex.response.data });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { newForm } = this.state;
        let { empuserid } = this.props.match.params;
        let error = this.validateAll();
        if (this.isValid(error)) {
            this.postData(`/empapp/empbills/${empuserid}`, newForm);
        } else {
            let s1 = { ...this.setState };
            s1.errors = error;
            this.setState(s1);
        }
    }

    isValid = (error) => {
        let keys = Object.keys(error);
        let count = keys.reduce((acc, curr) => (error[curr] ? acc + 1 : acc), 0);
        return count === 0;
    }

    validateAll = () => {
        let { description, expensetype, amount } = this.state.newForm;
        let errors = {};
        errors.description = this.handleDescription(description);
        errors.expensetype = this.handleExpensetype(expensetype);
        errors.amount = this.handleAmount(amount);
        return errors;
    }

    handleAmount = (amount) => {
        if (!amount) {
            return "Amount is required.";
        }

        // Use a regular expression to check if the amount is in the valid format.
        const validAmountPattern = /^\d+(\.\d{1,2})?$/;
        if (!validAmountPattern.test(amount)) {
            return "Invalid amount format. Please enter a valid number with up to two decimal places.";
        }

        return "";
    }
    handleDescription = (description) => !description ? "Required" : "";
    handleExpensetype = (expensetype) => !expensetype ? "Required" : "";

    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "description": s1.errors.description = this.handleDescription(input.value); break;
            case "expensetype": s1.errors.expensetype = this.handleExpensetype(input.value); break;
            case "amount": s1.errors.amount = this.handleAmount(input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    handleDetails = (billid, details) => {
        console.log("Deatails", details)
        let { empuserid } = this.props.match.params;
        if (details === "Hotel") {
            this.props.history.push(`/empapp/hotelbill/${empuserid}/${billid}`)
        } else {
            this.props.history.push(`/empapp/travelbill/${empuserid}/${billid}`)
        }
    }

    render() {
        let { emp, view, newForm, errors, successMsg, errorMsg } = this.state;
        let { description, expensetype, amount } = this.state.newForm;
        let expenses = ["Travel", "Hotel", "Software", "Communication", "Others"];

        return (
            <div className="container mt-2">
                <h2 className="text-center">Welcome to Employee Management Portal</h2>
                <div className="row mt-4">
                    <h3>Details of Bills Submitted</h3>
                </div>
                <div className="row text-center bg-primary text-white">
                    <div className="col-sm-2 border">ID</div>
                    <div className="col-sm-4 border">Description</div>
                    <div className="col-sm-2 border">Expense Head</div>
                    <div className="col-sm-2 border">Amount</div>
                    <div className="col-sm-2 border"></div>
                </div>
                {emp.map((ele, index) => (
                    <div className="row text-center">
                        <div className="col-sm-2 border">{ele.billid}</div>
                        <div className="col-sm-4 border">{ele.description}</div>
                        <div className="col-sm-2 border">{ele.expensetype}</div>
                        <div className="col-sm-2 border">{ele.amount}</div>
                        <div className="col-sm-2 border">
                            {
                                ele.expensetype === "Travel" || ele.expensetype === "Hotel" ?
                                    <button className="btn" onClick={() => this.handleDetails(ele.billid, ele.expensetype)}>
                                        <i className="fa fa-plus-square"></i>
                                    </button> : ""
                            }
                        </div>
                    </div>
                )
                )}

                <div className="row mt-3 mb-3">
                    <h3 className="text-decoration-underline" onClick={() => this.handleNewForm()}>Submit a New Bill</h3>
                </div>

                {view === 1 && (
                    <div className="bg-light mt-2 text-center">
                        <h3 className="text-center">Enter details of the new Bill</h3>

                        {successMsg !== "" ? (<span className="text-success"><h4>{successMsg}</h4></span>) :
                            (<span className="text-danger"><h4>{errorMsg}</h4></span>)
                        }

                        <form className="mt-4">
                            <div className="form-group row">
                                <div className="col-sm-3"></div>
                                <label className="form-group-label col-sm-3"><b>Description: </b></label>
                                <div className="col-sm-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={description}
                                        placeholder="Enter description"
                                        onChange={this.handleChange}
                                        onBlur={this.handleFocusValidation}
                                    />
                                </div>
                                {errors.description ? (<span className="text-danger">{errors.description}</span>) : ""}
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-3"></div>
                                <label className="form-group-label col-sm-3"><b>Expense Type: </b></label>
                                <div className="col-sm-6">
                                    <select className="form-control" name="expensetype" id="expensetype" value={expensetype} onChange={this.handleChange} onBlur={this.handleFocusValidation}>
                                        <option value="">Select ExpenseType</option>
                                        {expenses.map((ele, index) => (
                                            <option key={index} value={ele}>{ele}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.expensetype ? (<span className="text-danger">{errors.expensetype}</span>) : ""}
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-3"></div>
                                <label className="form-group-label col-sm-3"><b>Amount: </b></label>
                                <div className="col-sm-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="amount"
                                        name="amount"
                                        value={amount}
                                        placeholder="Enter amount"
                                        onChange={this.handleChange}
                                        onBlur={this.handleFocusValidation}
                                    />
                                </div>
                                {errors.amount ? (<span className="text-danger">{errors.amount}</span>) : ""}
                            </div>

                        </form>
                        <button className="btn btn-primary mt-2 mb-3" onClick={this.handleSubmit} 
                        disabled={successMsg}>
                            Submit</button>
                    </div>
                )}
            </div>
        )
    }
}
export default Bills;