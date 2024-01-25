import React, { Component } from "react";
import auth from "./httpServiceAuthEmp.js";
import { Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./httpEmployeeNavbar";
import Login from "./httpEmployeeLogin";
import Logout from "./httpEmployeeLogout";
import Admin from "./httpEmployeeAdmin";
import MyPortal from "./httpEmployeeMyPortal.jsx";
import ViewEmployee from "./httpEmployeeView.jsx";
import Add from "./httpEmployeeAdd.jsx";
import Details from "./httpEmployeeDepartment.jsx";
import Contact from "./httpEmployeeContact.jsx";
import Bills from "./httpEmployeeBills.jsx";
import Hotel from "./httpEmployeeHotel.jsx";
import Travel from "./httpEmployeeTravel.jsx";
import NotAllowed from "./httpEmployeeNotAllowed.jsx";

class MainEmployee extends Component {
    render() {
        const user = auth.getUser();
        return (
            <div className="container">
                <Navbar user={user} />

                <Switch>
                    <Route path="/emp/empcontact/:empuserid"
                        render={(props) =>
                            user ? user.role === "EMPLOYEE" ? <Contact {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/empapp/empbills/:empuserid"
                        render={(props) =>
                            user ? user.role === "EMPLOYEE" ? <Bills {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/empapp/hotelbill/:empid/:billid"
                        render={(props) =>
                            user ? user.role === "EMPLOYEE" ? <Hotel {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/empapp/travelbill/:empid/:billid"
                        render={(props) =>
                            user ? user.role === "EMPLOYEE" ? <Travel {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/empapp/empdept/:empuserid"
                        render={(props) =>
                            user ? user.role === "ADMIN" ? <Details {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/admin/View Employees"
                        render={(props) =>
                            user ? user.role === "ADMIN" ? <ViewEmployee {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/admin/Add Employee"
                        render={(props) =>
                            user ? user.role === "ADMIN" ? <Add {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/admin"
                        render={(props) =>
                            user ? user.role === "ADMIN" ? <Admin {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />

                    <Route path="/emp"
                        render={(props) =>
                            user ? user.role === "EMPLOYEE" ? <MyPortal {...props} /> : <Redirect to="/notAllowed" /> : <Redirect to="/login" />}
                    />
                    <Route path="/logout" component={Logout} />
                    <Route path="/login" component={Login} />
                    <Route path="/notAllowed" component={NotAllowed} />

                    <Redirect from="/" to="/login" />
                </Switch>
            </div>
        )
    }
}
export default MainEmployee;