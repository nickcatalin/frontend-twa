import React from "react";
import { request, setAuthHeader, setRoles } from "../axios_helper";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // Import the Toast component

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.toast = React.createRef();
  }

  handleLogin = (e) => {
    e.preventDefault();

    request("POST", "/login", {
      login: this.state.email,
      password: this.state.password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setRoles(response.data.roles);

        if (this.props.onLoginSuccess) {
          this.props.onLoginSuccess();
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        this.showErrorToast();
        setAuthHeader(null);
      });
  };

  showErrorToast() {
    this.toast.current.show({
      severity: "error",
      summary: "Login Error",
      detail: "Invalid username or password",
      life: 3000,
    });
  }

  render() {
    return (
      <div className="size-1/2">
        <Toast ref={this.toast} />
        <Card
          title="Login"
          className="p-mb-2 size-full flex justify-center items-center rounded-xl"
        >
          <form onSubmit={this.handleLogin} className="card space-y-6">
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="email"
                  type="text"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <label htmlFor="email">Username</label>
              </FloatLabel>
            </div>
            <div className="p-fluid">
              <FloatLabel>
                <InputText
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>

            <div className="p-fluid flex justify-center">
              <Button type="submit" label="Login" className="p-button-raised" />
            </div>

            <div className="p-fluid flex justify-center">
              <Button
                label="Don't have an account? Register"
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
