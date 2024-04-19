import React, { useEffect, useState } from "react";
import { request } from "../axios_helper";
import { Card } from "primereact/card";
import { Editor } from "primereact/editor";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [visible, setVisible] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    questionAnswer: "",
    stars: 0,
    isPrivate: false,
    content: "",
  });

  const questionOptions = [
    { label: "Yes, definitely", value: "Yes, definitely" },
    { label: "Maybe", value: "Maybe" },
    { label: "No, not really", value: "No, not really" },
  ];

  const starOptions = [1, 2, 3, 4, 5]; // Options for star rating

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const response = await request("GET", "/getFeedbacks");
    setFeedbacks(response.data);
  };

  const submitFeedback = async () => {
    const response = await request("POST", "/addFeedback", newFeedback);
    setVisible(false);
    setNewFeedback({
      questionAnswer: "",
      stars: 0,
      isPrivate: false,
      content: "",
    });
    fetchFeedbacks();
  };

  const onInputChange = (name, value) => {
    setNewFeedback({ ...newFeedback, [name]: value });
  };

  const feedbackTemplate = (feedback) => {
    return (
      <Card
        title={feedback.user.login}
        style={{ width: "25em", marginBottom: "2em" }}
      >
        <div className="p-grid">
          <div className="p-col-12">
            <h5>Would you recommend this app to your friends?</h5>
            <p>{feedback.questionAnswer}</p>
            <h5>Rating:</h5>
            {[...Array(feedback.stars)].map((e, i) => (
              <i key={i} className="pi pi-star" style={{ color: "gold" }}></i>
            ))}
            {feedback.isPrivate && (
              <i className="pi pi-lock" style={{ marginLeft: "5px" }}></i>
            )}
          </div>
          <div className="p-col-12">
            <InputTextarea
              style={{ height: "100px", width: "100%" }}
              value={feedback.content}
              readOnly={true}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <h1>Feedback</h1>
      <Button
        label="Add Feedback"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
      />
      <Sidebar className="w-1/3 h-1/2"
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
      >
        <h3>New Feedback</h3>
        <div className="p-fluid space-y-2">
          <InputTextarea
            placeholder="Content"
            value={newFeedback.content}
            onChange={(e) => onInputChange("content", e.target.value)}
            autoResize
          />
          <Dropdown
            value={newFeedback.questionAnswer}
            options={questionOptions}
            onChange={(e) => onInputChange("questionAnswer", e.value)}
            placeholder="Would you recommend this app to your friends?"
          />
          <h5>How would you rate this app?</h5>
          <div className="grid grid-cols-5 gap-2">
            {starOptions.map((value) => (
              <div key={value}>
                <RadioButton
                  inputId={`star${value}`}
                  value={value}
                  onChange={(e) => onInputChange("stars", e.value)}
                  checked={newFeedback.stars === value}
                />
                <label htmlFor={`star${value}`} className="p-ml-2">
                  {value}
                </label>
              </div>
            ))}
          </div>
          <Checkbox
            inputId="isPrivate"
            checked={newFeedback.isPrivate}
            onChange={(e) => onInputChange("isPrivate", e.checked)}
          />
          <label htmlFor="isPrivate" className="p-ml-2">
            Make this feedback private
          </label>
          <Button label="Submit" icon="pi pi-check" onClick={submitFeedback} />
        </div>
      </Sidebar>

      <div className="grid grid-cols-3 gap-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="p-col-12 p-md-4">
            {feedbackTemplate(feedback)}
          </div>
        ))}
      </div>
    </div>
  );
}
