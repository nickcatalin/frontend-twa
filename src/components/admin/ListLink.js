import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { request } from "../../axios_helper";
import AddLinkForm from "./AddLinkForm";
import EditLinkForm from "./EditLinkForm";

export default function AdminListLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setLoading(true);
    request("GET", "/admin/getLinks")
      .then((response) => {
        setLinks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch links:", error);
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <AddLinkForm />
      </div>
    );
  };

  const handleDelete = (rowData) => {
    request("DELETE", `/admin/deleteLink/${rowData.id}`)
      .then(() => {
        setLinks(links.filter((link) => link.id !== rowData.id));
      })
      .catch((error) => {
        console.error("Failed to delete link:", error);
      });
  };

  const actionBodyTemplate = (rowData) => {
    const onSuccess = () => {
      request("GET", "/admin/getLinks")
        .then((response) => {
          setLinks(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch links:", error);
        });
    };

    return (
      <React.Fragment>
        <EditLinkForm linkData={rowData} onSuccess={onSuccess} />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => handleDelete(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={links}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        loading={loading}
        globalFilterFields={["title", "description"]}
        header={header}
        emptyMessage="No links found."
      >
        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="url"
          header="URL"
          body={(rowData) => (
            <a href={rowData.url} target="_blank" rel="noopener noreferrer">
              {rowData.url}
            </a>
          )}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="description"
          header="Description"
          filter
          filterPlaceholder="Search by description"
          style={{ minWidth: "14rem" }}
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
