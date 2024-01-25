import React, {Component} from "react";
import auth from "./httpServiceAuthEmp.js";

class MyPortal extends Component {
    render () {
        let user = auth.getUser();
        return(
            <div className="container">
                <h2>Welcome {user.name} to the Employee Management Portal</h2>
            </div>
        )
    }
}
export default MyPortal;