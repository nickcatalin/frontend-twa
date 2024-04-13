import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Avatar } from "primereact/avatar";
import { Rating } from "primereact/rating";
import { OverlayPanel } from "primereact/overlaypanel"; // Import OverlayPanel
import { Knob } from "primereact/knob"; // Import Knob
import { FilterMatchMode } from "primereact/api";
import { request } from "../axios_helper";
import { Card } from "primereact/card";

export default function ListLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [comments, setComments] = useState([]);
  const [commentDialog, setCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [selectedLinkRating, setSelectedLinkRating] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const op = useRef(null);

  useEffect(() => {
    setLoading(true);
    request("GET", "/getLinks")
      .then((response) => {
        setLinks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch links:", error);
        setLoading(false);
      });
  }, []);

  const fetchCommentsAndRating = (linkId) => {
    request("GET", `/getComments/${linkId}`)
      .then((response) => {
        setComments(response.data);
        setCommentDialog(true);
        setSelectedLinkId(linkId);
      })
      .catch((error) => console.error("Failed to fetch comments:", error));

    request("GET", `/getRating/${linkId}`)
      .then((response) => {
        setSelectedLinkRating(response.data);
      })
      .catch((error) => console.error("Failed to fetch rating:", error));

    request("GET", `/getAverageRating/${linkId}`)
      .then((response) => {
        setOverallRating(response.data);
      })
      .catch((error) =>
        console.error("Failed to fetch overall rating:", error)
      );
  };

  const updateRating = (newRatingValue) => {
    const updatedRatingDto = {
      ...selectedLinkRating,
      rating: newRatingValue,
    };

    request("POST", `/updateRating/${selectedLinkId}`, updatedRatingDto)
      .then(() => {
        console.log("Rating updated successfully");
        setSelectedLinkRating(updatedRatingDto);
        fetchCommentsAndRating(selectedLinkId);
      })
      .catch((error) => {
        console.error("Failed to update rating:", error);
      });
  };

  const addComment = () => {
    if (newComment.trim()) {
      request("POST", `/addComment/${selectedLinkId}`, {
        content: newComment,
      }).then(() => {
        fetchCommentsAndRating(selectedLinkId);
        setNewComment("");
      });
    }
  };

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
      </div>
    );
  };

  const renderCommentsDialog = () => {
    const renderHeader = (login) => {
      return (
        <span className="ql-formats">
          <Avatar icon="pi pi-user" className="mr-2" />
          {login}
        </span>
      );
    };

    return (
      <Dialog
        header="Comments"
        visible={commentDialog}
        className="w-1/2"
        modal
        onHide={() => setCommentDialog(false)}
      >
        <Button
          label="Show Rating"
          onClick={(e) => op.current.toggle(e)}
          aria-haspopup
          aria-controls="overlay_panel"
          className="mb-2"
        />
        <OverlayPanel
          ref={op}
          id="overlay_panel"
          className="p-d-flex p-jc-center"
        >
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-1/6">
            <div className="flex justify-center items-center">
              <Card title="Your Rating" className="rounded-xl h-full">
                <Rating
                  value={selectedLinkRating?.rating}
                  onChange={(e) => updateRating(e.value)}
                  cancel={false}
                />
              </Card>
            </div>

            <div className="flex justify-center items-center">
              <Card title="Overall Rating" className="rounded-xl h-full">
                <Knob
                  className="flex justify-center items-center"
                  value={overallRating}
                  readOnly
                />
              </Card>
            </div>
          </div>
        </OverlayPanel>
        {comments.map((comment, index) => (
          <div key={index} className="comment-container">
            <Editor
              headerTemplate={renderHeader(comment.user.login)}
              style={{ height: "auto" }}
              value={comment.content}
              readOnly={true}
            />
          </div>
        ))}
        <h3>Add a comment</h3>
        <Editor
          style={{ height: "320px" }}
          value={newComment}
          onTextChange={(e) => setNewComment(e.htmlValue)}
        />
        <Button label="Submit" onClick={addComment} className="mt-2" />
      </Dialog>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      {renderCommentsDialog()}
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
          body={(rowData) => (
            <Button
              label="Comments"
              icon="pi pi-comments"
              onClick={() => fetchCommentsAndRating(rowData.id)}
            />
          )}
          headerStyle={{ width: "8em", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
        />
      </DataTable>
    </div>
  );
}
