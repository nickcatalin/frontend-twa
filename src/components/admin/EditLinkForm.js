import React from "react";
import { request } from "../../axios_helper";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OverlayPanel } from "primereact/overlaypanel";

export default class EditLinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.linkData.url,
      title: props.linkData.title,
      description: props.linkData.description,
    };
    this.op = React.createRef();
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    request("PUT", `admin/updateLink/${this.props.linkData.id}`, this.state)
      .then((response) => {
        console.log("Link updated successfully:", response.data);
        this.props.onSuccess();
        this.op.current.hide();
      })
      .catch((error) => {
        console.error("Error updating link:", error);
      });
  };

  render() {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={(e) => this.op.current.toggle(e)}
        />
        <OverlayPanel
          ref={this.op}
          showCloseIcon
          id="overlay_panel_edit"
          style={{ width: "450px" }}
          className="overlaypanel-demo"
        >
          <Card title="Edit Link" className="p-mb-2">
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
                  label="Update"
                  icon="pi pi-check"
                  className="p-button-raised p-button-warning"
                />
              </div>
            </form>
          </Card>
        </OverlayPanel>
      </>
    );
  }
}
