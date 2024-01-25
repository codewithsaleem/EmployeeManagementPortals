import React, {Component} from "react";
import auth from "./httpServiceAuthEmp.js";
class Admin extends Component {
    render() {
        let user = auth.getUser();
        return(
            <div className="container">
                <h2>Welcome, {user.name} to Admin Page</h2>
            </div>
        )
    }
}
export default Admin;