import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
class Travel extends Component {
    state = {
        travelForm: {
            goflightDate: "", goflightOrigin: "", goflightDest: "", goflightNum: "", corpbooking: "No", backflightDate: "", backflightOrigin: "", backflightDest: "", backflightNum: "",
            empuserid: "", amount: "", billid: "", description: "", expensetype: ""
        },
        errors: {},
        errors1: "",
        successMsg: "",
        errorMsg: "",

        years: ["1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
            "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dates: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    }

    async fetchData() {
        let { empid, billid } = this.props.match.params;
        try {
            if (empid) {
                let response = await http.get(`/empapp/travelbill/${empid}/${billid}`);
                let { data } = response;
                this.setState({ travelForm: data })
            }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                let errors = ex.response.data;
                this.setState({ errors1: errors, travelForm: errors })
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
        const { currentTarget: input } = e;
        const s1 = { ...this.state };

        if (input.name === "corpbooking") {
            s1.travelForm[input.name] = input.checked ? "Yes" : "No";
        } else {
            s1.travelForm[input.name] = input.value;
        }

        this.handleFocusValidation(e);
        this.setState(s1);
    }


    async postData(url, obj) {
        try {
            // Combine the selected date, month, and year into staystartdate
            const { goflightDate, staystartdateMonth, staystartdateYear, backflightDate, stayendmonth, stayendyear, ...rest } = obj;
            const combinedStayStartDate = `${goflightDate}-${staystartdateMonth}-${staystartdateYear}`;
            const combinedStayEndDate = `${backflightDate}-${stayendmonth}-${stayendyear}`;

            // Update the obj with the combined staystartdate and stayenddate
            const updatedObj = { ...rest, goflightDate: combinedStayStartDate, backflightDate: combinedStayEndDate };

            let response = await http.post(url, updatedObj);
            let { data } = response;
            this.setState({ successMsg: data });
            // this.props.history.push("/admin/View Employees");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                this.setState({ errorMsg: ex.response.data });
            }
        }
    }


    async putData(url, obj) {
        let response = await http.put(url, obj);
        let { data } = response;
        // this.props.history.push("/admin/View Employees");
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { travelForm } = this.state;
        let errors = this.validateAll();

        if (this.isValid(errors)) {
            // this.putData(`/empapp/empcontact/${contactForm.empuserid}`, contactForm) :
            this.postData("/empapp/travelbill", travelForm)
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
        let { goflightDate, goflightOrigin, goflightDest, goflightNum, corpbooking, backflightDate, backflightOrigin, backflightDest, backflightNum } = this.state.travelForm;
        let errors = {};
        errors.goflightDate = this.handleGoflightDate(goflightDate);
        errors.goflightOrigin = this.handleGoflightOrigin(goflightOrigin);
        errors.goflightDest = this.handleGoflightDest(goflightDest);
        errors.goflightNum = this.handleGoflightNum(goflightNum);
        errors.corpbooking = this.handleCorpbooking(corpbooking);

        errors.backflightDate = this.handleBackflightDate(backflightDate);
        errors.backflightOrigin = this.handleBackflightOrigin(backflightOrigin);
        errors.backflightDest = this.handleBackflightDest(backflightDest);
        errors.backflightNum = this.handleBackflightNum(backflightNum);
        return errors;
    }

    handleGoflightDate = (goflightDate) => !goflightDate ? "Required" : "";
    handleGoflightOrigin = (goflightOrigin) => !goflightOrigin ? "Required" : "";
    handleGoflightDest = (goflightDest) => !goflightDest ? "Required" : "";
    handleGoflightNum = (goflightNum) => !goflightNum ? "Required" : "";
    handleCorpbooking = (corpbooking) => !corpbooking ? "Required" : "";

    handleBackflightDate = (backflightDate) => !backflightDate ? "Required" : "";
    handleBackflightOrigin = (backflightOrigin) => !backflightOrigin ? "Required" : "";
    handleBackflightDest = (backflightDest) => !backflightDest ? "Required" : "";
    handleBackflightNum = (backflightNum) => !backflightNum ? "Required" : "";

    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "goflightDate": s1.errors.goflightDate = this.handleGoflightDate(input.value); break;
            case "goflightOrigin": s1.errors.goflightOrigin = this.handleGoflightOrigin(input.value); break;
            case "goflightDest": s1.errors.goflightDest = this.handleGoflightDest(input.value); break;
            case "goflightNum": s1.errors.goflightNum = this.handleGoflightNum(input.value); break;
            case "corpbooking": s1.errors.corpbooking = this.handleCorpbooking(input.value); break;

            case "backflightDate": s1.errors.backflightDate = this.handleBackflightDate(input.value); break;
            case "backflightOrigin": s1.errors.backflightOrigin = this.handleBackflightOrigin(input.value); break;
            case "backflightDest": s1.errors.backflightDest = this.handleBackflightDest(input.value); break;
            case "backflightNum": s1.errors.backflightNum = this.handleBackflightNum(input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    render() {
        let { goflightDate, goflightOrigin, goflightDest, goflightNum, corpbooking, backflightDate, backflightOrigin, backflightDest, backflightNum } = this.state.travelForm;
        let { errors, travelForm, edit, successMsg, years, months, dates } = this.state;
        let { billid } = this.props.match.params;
        let { errors1 = null } = this.state;
        console.log("errors1", errors1)

        const stayStartDateParts = goflightDate ? goflightDate.split('-') : [];
        const selectedDate = stayStartDateParts[0];
        const selectedMonth = stayStartDateParts[1];
        const selectedYear = stayStartDateParts[2];

        const stayEndDateParts = backflightDate ? backflightDate.split('-') : [];
        const selectedDate1 = stayEndDateParts[0];
        const selectedMonth1 = stayEndDateParts[1];
        const selectedYear1 = stayEndDateParts[2];

        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light mt-4">
                    <h3 className="text-center">Flight Details</h3>
                    <h4 className="text-center mt-3">Bill Id : {billid}</h4>

                    {successMsg !== "" ? (
                        <span className="text-success">
                            <h4>{successMsg}</h4>
                        </span>
                    ) :
                        errors1 ? (<span className="text-danger"><h4>No Travel Details Found. Please Enter them</h4></span>) :
                            (<span className="text-primary"><h4>Displaying Travel Details</h4></span>)
                    }
                    <hr />

                    <h3 className="text-center">Departure Flight Details</h3>

                    <form className="mt-4">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Flight date: </b></label>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="goflightDate"
                                    name="goflightDate"
                                    value={selectedDate}
                                    placeholder="Enter goflightDate"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Date</option>
                                    {dates.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="staystartdateMonth"
                                    name="staystartdateMonth"
                                    value={selectedMonth}
                                    placeholder="Enter goflightmonth"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Month</option>
                                    {months.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="staystartdateYear"
                                    name="staystartdateYear"
                                    value={selectedYear}
                                    placeholder="Enter goflightDateyear"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Year</option>
                                    {years.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.goflightDate ? (<span className="text-danger">{errors.goflightDate}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Origin City: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="goflightOrigin"
                                    name="goflightOrigin"
                                    value={goflightOrigin}
                                    placeholder="Enter goflightOrigin"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.goflightOrigin ? (<span className="text-danger">{errors.goflightOrigin}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Destination City: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="goflightDest"
                                    name="goflightDest"
                                    value={goflightDest}
                                    placeholder="Enter goflightDest"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.goflightDest ? (<span className="text-danger">{errors.goflightDest}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Flight Number: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="goflightNum"
                                    name="goflightNum"
                                    value={goflightNum}
                                    placeholder="Enter goflightNum"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.goflightNum ? (<span className="text-danger">{errors.goflightNum}</span>) : ""}
                        </div>
                        <hr />

                        <h3 className="text-center">Return Flight Details</h3>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Flight Date: </b></label>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="backflightDate"
                                    name="backflightDate"
                                    value={selectedDate1}
                                    placeholder="Enter backflightDate"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Date</option>
                                    {dates.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="stayendmonth"
                                    name="stayendmonth"
                                    value={selectedMonth1}
                                    placeholder="Enter stayendmonth"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Month</option>
                                    {months.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="stayendyear"
                                    name="stayendyear"
                                    value={selectedYear1}
                                    placeholder="Enter stayendyear"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Year</option>
                                    {years.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.backflightDate ? (<span className="text-danger">{errors.backflightDate}</span>) : ""}
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Origin City: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="backflightOrigin"
                                    name="backflightOrigin"
                                    value={backflightOrigin}
                                    placeholder="Enter backflightOrigin"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.backflightOrigin ? (<span className="text-danger">{errors.backflightOrigin}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Destination City: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="backflightDest"
                                    name="backflightDest"
                                    value={backflightDest}
                                    placeholder="Enter backflightDest"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.backflightDest ? (<span className="text-danger">{errors.backflightDest}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Flight Number: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="backflightNum"
                                    name="backflightNum"
                                    value={backflightNum}
                                    placeholder="Enter backflightNum"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.backflightNum ? (<span className="text-danger">{errors.backflightNum}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-5"></div>
                            <div className="col-sm-1">
                                <input
                                    type="checkbox"
                                    id="corpbooking"
                                    name="corpbooking"
                                    checked={corpbooking === "Yes"}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <label className="form-group-label col-sm-2"><b>Corporate Booking</b></label>
                            {errors.corpbooking ? (<span className="text-danger">{errors.corpbooking}</span>) : ""}
                        </div>

                    </form>
                    <button
                        className="btn btn-primary mt-2 mb-3"
                        onClick={this.handleSubmit}
                        disabled={(errors.goflightDate || errors.goflightDest || errors.goflightOrigin || errors.goflightNum || errors.corpbooking
                            || errors.backflightDate || errors.backflightDest || errors.backflightOrigin || errors.backflightNum)
                            || !errors1 || successMsg
                        }>
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}
export default Travel;