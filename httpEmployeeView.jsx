import React, { Component } from "react";
import http from "./httpServiceEmployee.js";
import auth from "./httpServiceAuthEmp.js";
import queryString from "query-string";

class ViewEmployee extends Component {
    state = {
        emp: [],
        pageJSON: {},
    }

    async fetchData() {
        let queryParams = queryString.parse(this.props.location.search);
        let searchStr = this.makeSearchString(queryParams);
        let response = await http.get(`/empapp/emps?${searchStr}`);
        let { data, pageInfo } = response.data;
        this.setState({ emp: data, pageJSON: pageInfo })
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) this.fetchData();
    }

    handleDetails = (empuserid) => {
        this.props.history.push(`/empapp/empdept/${empuserid}`);
    }

    handlePage = (num) => {
        let queryParams = queryString.parse(this.props.location.search);
        let { page = "1" } = queryParams;
        let newPage = +page + num;
        queryParams.page = newPage;
        this.callURL("/admin/View Employees", queryParams);
    }


    callURL = (url, options) => {
        let searchStr = this.makeSearchString(options);
        this.props.history.push({
            pathname: url,
            search: searchStr,
        })
    }

    makeSearchString = (options) => {
        let { page } = options;
        let searchStr = "";
        searchStr = this.addToQueryString(searchStr, "page", page);
        return searchStr;
    }

    addToQueryString = (str, paramName, paramValue) =>
        paramValue ? str ? `${str}&${paramName}=${paramValue}` : `${paramName}=${paramValue}` : str;

    render() {
        let { emp } = this.state;
        console.log("emp", emp.length)
        let { pageNumber, numberOfPages, numOfItems, totalItemCount } = this.state.pageJSON;

        // Calculate the start and end page numbers for the current range
        let size = 5;
        let startIndex = (pageNumber - 1) * size + 1;
        let endIndex;
        if (pageNumber * size > totalItemCount) {
            endIndex = totalItemCount;
        } else {
            endIndex = pageNumber * size;
        }

        return (
            <div className="container mt-2">
                <div className="row">
                    <h3>{startIndex} to {endIndex} of {totalItemCount}</h3>
                </div>
                <div className="row text-center bg-primary text-white">
                    <div className="col-sm-4 border">Name</div>
                    <div className="col-sm-4 border">Email</div>
                    <div className="col-sm-4 border"></div>
                </div>
                {emp.map((ele) => (
                    <div className="row text-center" key={ele.empuserid}>
                        <div className="col-sm-4 border">{ele.name}</div>
                        <div className="col-sm-4 border">{ele.email}</div>
                        <div className="col-sm-4 border">
                            {ele.role === "EMPLOYEE" && (
                                <button className="btn btn-secondary" onClick={() => this.handleDetails(ele.empuserid)}>Details</button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="row">
                    <div className="col-sm-1">
                        {startIndex > 1 ? (<button className=" btn btn-sm btn-primary mt-2" onClick={() => this.handlePage(-1)}>Prev</button>) : ""}
                    </div>
                    <div className="col-sm-10"></div>
                    <div className="col-sm-1">
                        {endIndex < totalItemCount ? (<button className=" btn btn-sm btn-primary mt-2" onClick={() => this.handlePage(1)}>Next</button>) : ""}
                    </div>
                </div>
            </div>
        )
    }
}
export default ViewEmployee;

















































