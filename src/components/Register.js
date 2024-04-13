import React from "react";
import { request, setAuthHeader, setRoles } from "../axios_helper";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      repeatPassword: "",
    };
    this.toast = React.createRef();
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleRegister = (e) => {
    e.preventDefault();

    if (this.state.password !== this.state.repeatPassword) {
      this.toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      login: this.state.login,
      password: this.state.password,
    };

    request("POST", "/register", user)
      .then((response) => {
        setAuthHeader(response.data.token);
        setRoles(response.data.roles);

        if (this.props.onRegisterSuccess) {
          this.props.onRegisterSuccess();
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        this.toast.current.show({
          severity: "error",
          summary: "Registration Error",
          detail: "Failed to register",
          life: 3000,
        });
        setAuthHeader(null);
      });
  };

  render() {
    return (
      <div className="size-2/3">
        <Toast ref={this.toast} />
        <Card
          title="Register"
          className="p-mb-2 size-full flex justify-center items-center rounded-xl"
        >
          <form onSubmit={this.handleRegister} className="card space-y-6">
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="firstName"
                  type="text"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                />
                <label htmlFor="firstName">First Name</label>
              </FloatLabel>
            </div>
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="lastName"
                  type="text"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                />
                <label htmlFor="lastName">Last Name</label>
              </FloatLabel>
            </div>
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="login"
                  type="text"
                  value={this.state.login}
                  onChange={this.handleInputChange}
                />
                <label htmlFor="login">Username (Login)</label>
              </FloatLabel>
            </div>
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="repeatPassword"
                  type="password"
                  value={this.state.repeatPassword}
                  onChange={this.handleInputChange}
                />
                <label htmlFor="repeatPassword">Repeat Password</label>
              </FloatLabel>
            </div>

            <div className="p-fluid flex justify-center">
              <Button
                type="submit"
                label="Register"
                className="p-button-raised"
              />
            </div>

            <div className="p-fluid flex justify-center">
              <Button
                label="Already have an account? Login"
                onClick={this.props.onToggle}
                className="p-button-text"
              />
            </div>
          </form>
        </Card>
      </div>
    );
  }
}
