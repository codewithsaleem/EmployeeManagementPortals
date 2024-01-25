import React, { Component } from "react";
import { Link } from "react-router-dom";
class Navbar extends Component {
    render() {
        let empAdmin = ["Add Employee", "View Employees"];
        let empEmployee = ["Contact Details", "Bills"];
        let { user } = this.props;
        return (
            <div className="container">
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <Link to="/" className="navbar-brand ms-3">Employee Portal</Link>

                    <ul className="navbar-nav mr-auto">
                        {user && user.role === "ADMIN" && (
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                                    Admin
                                </a>
                                <div className="dropdown-menu">
                                    {empAdmin.map((ele, index) => (
                                        <Link to={`/admin/${ele}`} key={index} className="dropdown-item">{ele}</Link>
                                    ))}
                                </div>
                            </li>
                        )}

                        {user && user.role === "EMPLOYEE" && (
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                                    My Portal
                                </a>
                                <div className="dropdown-menu">
                                    {empEmployee.map((ele, index) => (
                                        <Link to={index === 0 ? `/emp/empcontact/${user.empuserid}` : `/empapp/empbills/${user.empuserid}`} key={index} className="dropdown-item">{ele}</Link>
                                    ))}
                                </div>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav ml-auto me-5">
                        {!user && (
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">LOGIN</Link>
                            </li>
                        )}

                        {user && (
                            <li className="nav-item">
                                <Link to="/logout" className="nav-link">LOGOUT</Link>
                            </li>
                        )}
                    </ul>

                </nav>
            </div>
        )
    }
}
export default Navbar;