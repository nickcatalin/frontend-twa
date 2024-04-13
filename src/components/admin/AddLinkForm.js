import React from "react";
import { request } from "../../axios_helper";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OverlayPanel } from "primereact/overlaypanel";

export default class AddLinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      title: "",
      description: "",
    };
    this.op = React.createRef();
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    request("POST", "/admin/addLink", this.state)
      .then((response) => {
        console.log("Link added successfully:", response.data);
        this.op.current.hide();
      })
      .catch((error) => {
        console.error("Error adding link:", error);
      });
  };

  render() {
    return (
      <>
        <Button
          label="Add Link"
          icon="pi pi-plus"
          onClick={(e) => this.op.current.toggle(e)}
          className="p-button-raised p-button-success"
        />
        <OverlayPanel
          ref={this.op}
          showCloseIcon
          id="overlay_panel"
          style={{ width: "450px" }}
          className="overlaypanel-demo"
        >
          <Card title="Add a Link" className="p-mb-2">
            <form onSubmit={this.handleSubmit} className="space-y-6">
              <div className="p-fluid">
                <FloatLabel>
                  <InputText
                    id="url"
                    value={this.state.url}
                    onChange={this.handleInputChange}
                  />
                  <label htmlFor="url">Url</label>
                </FloatLabel>
              </div>
              <div className="p-fluid">
                <FloatLabel>
                  <InputText
                    id="title"
                    value={this.state.title}
                    onChange={this.handleInputChange}
                  />
                  <label htmlFor="title">Title</label>
                </FloatLabel>
              </div>
              <div className="p-fluid">
                <FloatLabel>
                  <InputText
                    id="description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                  />
                  <label htmlFor="description">Description</label>
                </FloatLabel>
              </div>
              <div className="p-fluid flex justify-center">
                <Button
                  type="submit"
                  label="Submit"
                  icon="pi pi-check"
                  className="p-button-raised"
                />
              </div>
            </form>
          </Card>
        </OverlayPanel>
      </>
    );
  }
}
