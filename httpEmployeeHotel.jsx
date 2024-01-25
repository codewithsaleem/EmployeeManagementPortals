import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
class Hotel extends Component {
    state = {
        hotelForm: {
            staystartdate: "", stayenddate: "", hotel: "", city: "", corpbooking: "No",
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
                let response = await http.get(`/empapp/hotelbill/${empid}/${billid}`);
                let { data } = response;
                this.setState({ hotelForm: data })
            }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                let errors = ex.response.data;
                this.setState({ errors1: errors, hotelForm: errors })
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
            s1.hotelForm[input.name] = input.checked ? "Yes" : "No";
        } else {
            s1.hotelForm[input.name] = input.value;
        }

        this.handleFocusValidation(e);
        this.setState(s1);
    }


    async postData(url, obj) {
        try {
            // Combine the selected date, month, and year into staystartdate
            const { staystartdate, staystartdateMonth, staystartdateYear, stayenddate, stayendmonth, stayendyear, ...rest } = obj;
            const combinedStayStartDate = `${staystartdate}-${staystartdateMonth}-${staystartdateYear}`;
            const combinedStayEndDate = `${stayenddate}-${stayendmonth}-${stayendyear}`;

            // Update the obj with the combined staystartdate and stayenddate
            const updatedObj = { ...rest, staystartdate: combinedStayStartDate, stayenddate: combinedStayEndDate };

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
        let { hotelForm, edit } = this.state;
        let errors = this.validateAll();

        if (this.isValid(errors)) {
                // this.putData(`/empapp/empcontact/${contactForm.empuserid}`, contactForm) :
                this.postData("/empapp/hotelbill", hotelForm)
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
        let { staystartdate, stayenddate, city, hotel, corpbooking } = this.state.hotelForm;
        let errors = {};
        errors.staystartdate = this.handleStaystartdate(staystartdate);
        errors.stayenddate = this.handleStayenddate(stayenddate);
        errors.city = this.handleCity(city);
        errors.hotel = this.handleHotel(hotel);
        errors.corpbooking = this.handleCorpbooking(corpbooking);
        return errors;
    }

    handleStaystartdate = (staystartdate) => !staystartdate ? "Required" : "";
    handleStayenddate = (stayenddate) => !stayenddate ? "Required" : "";
    handleCity = (city) => !city ? "Required" : "";
    handleHotel = (hotel) => !hotel ? "Required" : "";
    handleCorpbooking = (corpbooking) => !corpbooking ? "Required" : "";

    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "staystartdate": s1.errors.staystartdate = this.handleStaystartdate(input.value); break;
            case "stayenddate": s1.errors.stayenddate = this.handleStayenddate(input.value); break;
            case "city": s1.errors.city = this.handleCity(input.value); break;
            case "hotel": s1.errors.hotel = this.handleHotel(input.value); break;
            case "corpbooking": s1.errors.corpbooking = this.handleCorpbooking(input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    render() {
        let { staystartdate, stayenddate, hotel, city, corpbooking } = this.state.hotelForm;
        let { errors, hotelForm, edit, successMsg, years, months, dates } = this.state;
        let { billid } = this.props.match.params;
        let { errors1 = null } = this.state;
        console.log("errors1", errors1)

        const stayStartDateParts = staystartdate ? staystartdate.split('-') : [];// Assuming your staystartdate is in "YYYY-MM-DD" format
        const selectedDate = stayStartDateParts[0];
        const selectedMonth = stayStartDateParts[1];
        const selectedYear = stayStartDateParts[2];

        const stayEndDateParts = stayenddate ? stayenddate.split('-') : []; // Assuming your stayenddate is in "YYYY-MM-DD" format
        const selectedDate1 = stayEndDateParts[0];
        const selectedMonth1 = stayEndDateParts[1];
        const selectedYear1 = stayEndDateParts[2];

        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light mt-4">
                    <h3 className="text-center">Hotel Stay Details</h3>
                    <h4 className="text-center mt-3">Bill Id : {billid}</h4>

                    {successMsg !== "" ? (
                        <span className="text-success">
                            <h4>{successMsg}</h4>
                        </span>
                    ) :
                        errors1 ? (<span className="text-danger"><h4>No Hotel Details Found. Please Enter them</h4></span>) :
                            (<span className="text-primary"><h4>Displaying Hotel Details</h4></span>)
                    }

                    <form className="mt-4">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Check In Date: </b></label>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="staystartdate"
                                    name="staystartdate"
                                    value={selectedDate}
                                    placeholder="Enter staystartdate"
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
                                    placeholder="Enter staystartdate"
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
                                    placeholder="Enter staystartdate"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                >
                                    <option value="">Select Year</option>
                                    {years.map((ele, index) => (
                                        <option key={index} value={ele}>{ele}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.staystartdate ? (<span className="text-danger">{errors.staystartdate}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Check Out Date: </b></label>
                            <div className="col-sm-2">
                                <select
                                    className="form-control"
                                    type="text"
                                    id="stayenddate"
                                    name="stayenddate"
                                    value={selectedDate1}
                                    placeholder="Enter stayenddate"
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
                            {errors.stayenddate ? (<span className="text-danger">{errors.stayenddate}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Hotel: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="hotel"
                                    name="hotel"
                                    value={hotel}
                                    placeholder="Enter hotel"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.hotel ? (<span className="text-danger">{errors.hotel}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>City: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={city}
                                    placeholder="Enter city"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.city ? (<span className="text-danger">{errors.city}</span>) : ""}
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
                        disabled={(errors.staystartdate || errors.stayenddate || errors.hotel || errors.city || errors.corpbooking)
                            || !errors1 || successMsg
                        }>
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}
export default Hotel;