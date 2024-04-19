import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { request } from "../../axios_helper"; // Ensure this is set up for API calls
import { TabView, TabPanel } from "primereact/tabview";
import { Editor } from "primereact/editor";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import { MultiSelect } from "primereact/multiselect";

export default function AdminListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    login: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [userDetails, setUserDetails] = useState(null);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([request("GET", "/admin/getUsers"), request("GET", "/admin/getRoles")])
      .then(([usersResponse, rolesResponse]) => {
        setUsers(usersResponse.data);
        setRoles(
          rolesResponse.data.map((role) => ({
            label: role.name,
            value: role,
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      });
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleDelete = (rowData) => {
    request("DELETE", `/admin/deleteUser/${rowData.id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== rowData.id));
      })
      .catch((error) => {
        console.error("Failed to delete user:", error);
      });
  };

  const handleViewDetails = (rowData) => {
    request("GET", `/admin/getUser/${rowData.id}`)
      .then((response) => {
        console.log("Fetched user details:", response.data); // Check what roles look like
        const formattedRoles = response.data.roles
          ? response.data.roles.map((role) => role.id)
          : [];
        const userData = { ...response.data, roles: formattedRoles };
        setUserDetails(userData);
        setDisplayDetails(true);
      })
      .catch((error) => {
        console.error("Failed to fetch user details:", error);
      });
  };

  const handleEdit = (rowData) => {
    setUserDetails(rowData);
    setDisplayEditDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info"
          onClick={() => handleViewDetails(rowData)}
          style={{ marginRight: ".5em" }}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => handleEdit(rowData)}
          style={{ marginRight: ".5em" }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </React.Fragment>
    );
  };

  const updateUserData = () => {
    if (userDetails) {
      const updatedDetails = {
        ...userDetails,
        roles: userDetails.roles,
      };

      request("PUT", `/admin/updateUser/${userDetails.id}`, updatedDetails)
        .then((response) => {
          const updatedUsers = users.map((user) =>
            user.id === userDetails.id ? { ...user, ...response.data } : user
          );
          setUsers(updatedUsers);
          setDisplayEditDialog(false);
        })
        .catch((error) => {
          console.error("Failed to update user:", error);
        });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.value !== undefined ? e.value : e.target.value;
    setUserDetails({ ...userDetails, [name]: val });
  };

  const renderEditDialog = () => (
    <Dialog
      header="Edit User Details"
      visible={displayEditDialog}
      style={{ width: "450px" }}
      modal
      onHide={() => setDisplayEditDialog(false)}
    >
      {userDetails && (
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              value={userDetails.firstName}
              onChange={(e) => onInputChange(e, "firstName")}
            />
          </div>
          <div className="p-field">
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              value={userDetails.lastName}
              onChange={(e) => onInputChange(e, "lastName")}
            />
          </div>
          <div className="p-field">
            <label htmlFor="login">Login</label>
            <InputText
              id="login"
              value={userDetails.login}
              onChange={(e) => onInputChange(e, "login")}
            />
          </div>
          <div className="p-field">
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              id="roles"
              value={userDetails.roles || []}
              options={roles}
              onChange={(e) => onInputChange(e, "roles")}
              optionLabel="label"
              optionValue="value"
              placeholder="Select roles"
              display="chip"
            />
          </div>
          <Button label="Save" icon="pi pi-check" onClick={updateUserData} />
        </div>
      )}
    </Dialog>
  );

  const renderDetailsDialog = () => {
    return (
      <Dialog
        header="User Details"
        visible={displayDetails}
        style={{ width: "50vw" }}
        onHide={() => setDisplayDetails(false)}
        modal
      >
        {userDetails && (
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-screen">
            <div>
              <h5>{`Name: ${userDetails.firstName} ${userDetails.lastName}`}</h5>
              <p>{`Username: ${userDetails.login}`}</p>
            </div>

            <div>
              <TabView>
                <TabPanel header="Comments">
                  <div className="space-y-3">
                    {userDetails.comments.map((comment) => (
                      <Editor
                        headerTemplate={comment.link.title}
                        style={{ height: "auto" }}
                        value={comment.content}
                        readOnly={true}
                      />
                    ))}
                  </div>
                </TabPanel>

                <TabPanel header="Ratings">
                  <div className="space-y-3">
                    {userDetails.ratings.map((rating) => (
                      <Card
                        title={rating.link.title}
                        className="rounded-xl h-full"
                      >
                        <Rating value={rating.rating} cancel={false} />
                      </Card>
                    ))}
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        )}
      </Dialog>
    );
  };

  const header = (
    <div className="flex justify-content-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );

  return (
    <div className="card">
      {renderDetailsDialog()}
      {renderEditDialog()}
      <DataTable
        value={users}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        loading={loading}
        globalFilterFields={["firstName", "lastName", "login"]}
        header={header}
        emptyMessage="No users found."
      >
        <Column
          field="firstName"
          header="First Name"
          filter
          filterPlaceholder="Search by first name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="lastName"
          header="Last Name"
          filter
          filterPlaceholder="Search by last name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="login"
          header="Login"
          filter
          filterPlaceholder="Search by login"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="roles"
          header="Roles"
          body={(rowData) => rowData.roles.map((role) => role.name).join(", ")}
          filter
          filterPlaceholder="Search by roles"
          style={{ minWidth: "12rem" }}
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "8rem", textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
}
