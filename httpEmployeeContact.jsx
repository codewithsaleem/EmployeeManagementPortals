import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
class Contact extends Component {
    state = {
        contactForm: { country: "", pincode: "", address: "", city: "", mobile: ""},
        errors: {},
        errors1: "",
        successMsg: "",
        errorMsg: "",
    }

    async fetchData() {
        let { empuserid } = this.props.match.params;
        try {
            if (empuserid) {
                let response = await http.get(`/empapp/empcontact/${empuserid}`);
                let { data } = response;
                this.setState({ contactForm: data})
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
        s1.contactForm[input.name] = input.value;
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
        let { contactForm } = this.state;
        let errors = this.validateAll();
        let { empuserid } = this.props.match.params;

        if (this.isValid(errors)) {
            // this.putData(`/empapp/empcontact/${contactForm.empuserid}`, contactForm) :
            this.postData(`/empapp/empcontact/${empuserid}`, contactForm)
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
        let { country, pincode, mobile } = this.state.contactForm;
        let errors = {};
        errors.country = this.handleCountry(country);
        errors.pincode = this.handlePincode(pincode);
        errors.mobile = this.handleMobile(mobile);
        return errors;
    }

    handleCountry = (country) => !country ? "Country Required" : "";
    handlePincode = (pincode) => !pincode ? "Pincode Required" : "";
    handleMobile = (mobile) => !mobile ? "Mobile Required" :
        mobile.length < 10 ||
            (!/[0-9+ \-]+$/.test(mobile)) ?
            "Mobile number has at least 10 characters and consists of digits(0-9),+,-and space" : "";

    handleFocusValidation = (e) => {
        let { currentTarget: input } = e;
        let s1 = { ...this.state };

        switch (input.name) {
            case "country": s1.errors.country = this.handleCountry(input.value); break;
            case "pincode": s1.errors.pincode = this.handlePincode(input.value); break;
            case "mobile": s1.errors.mobile = this.handleMobile(input.value); break;
            default: break;
        }
        this.setState(s1);
    }

    render() {
        let { country, pincode, address, city, mobile } = this.state.contactForm;
        let { errors, contactForm, edit, successMsg } = this.state;
        let { errors1 = null } = this.state;

        return (
            <div className="container text-center">
                <h2>Welcome to Employee Management Portal</h2>

                <div className="bg-light mt-4">
                    <h3 className="text-center">Your Contact Details</h3>

                    {successMsg !== "" ? (
                        <span className="text-success">
                            <h4>Contact Details have been successfully added</h4>
                        </span>
                    ) :
                        errors1 ? (<span className="text-danger"><h4>No Contact Details Found. Please Enter them</h4></span>) :
                            (<span className="text-primary"><h4>Displaying Contact Details</h4></span>)
                    }

                    <form className="mt-4">
                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Mobile: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="mobile"
                                    name="mobile"
                                    value={mobile}
                                    placeholder="Enter mobile number"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.mobile ? (<span className="text-danger">{errors.mobile}</span>) : ""}
                        </div>


                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Address: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={address}
                                    placeholder="Enter address"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.address ? (<span className="text-danger">{errors.address}</span>) : ""}
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
                                    placeholder="Enter city name"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.city ? (<span className="text-danger">{errors.city}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>Country: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={country}
                                    placeholder="Enter country name"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.country ? (<span className="text-danger">{errors.country}</span>) : ""}
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3"></div>
                            <label className="form-group-label col-sm-3"><b>PinCode: </b></label>
                            <div className="col-sm-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={pincode}
                                    placeholder="Enter pincode"
                                    onChange={this.handleChange}
                                    onBlur={this.handleFocusValidation}
                                />
                            </div>
                            {errors.pincode ? (<span className="text-danger">{errors.pincode}</span>) : ""}
                        </div>

                    </form>
                    <button className="btn btn-primary mt-2 mb-3" onClick={this.handleSubmit}
                        disabled={(errors.mobile || errors.pincode || errors.country)
                            || !errors1 || successMsg}>Submit</button>
                </div>
            </div>
        )
    }
}
export default Contact;