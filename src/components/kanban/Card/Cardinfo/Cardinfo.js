import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./Cardinfo.css";
import {
  Calendar,
  CheckSquare,
  Tag,
  Type,
  Trash,
} from "react-feather";
import { List } from "react-feather";
import Editable from "../../Editable/Editable";
import Chip from "../../Chip/Chip";

export const Cardinfo = (props) => {
  const { card_title, labels, card_desc, card_date, tasks } = props.card;

  const calculatePercent = () => {
    if (tasks?.length == 0) return "0";
    const completed = tasks?.filter((item) => item.task_completed == 1)?.length;
    return (completed / tasks?.length) * 100 + "";
  };

  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#230959",
  ];

  const [activeColor, setActiveColor] = useState("");

  const [values, setValues] = useState({
    ...props.card,
  });
  

  const addLabel = (text, color, cardId) => {
    const userId = props.userId;
    console.log({ text, color, userId, cardId });

    fetch("http://spring90.dothome.co.kr/addlabel.php", {
      method: "POST",
      body: JSON.stringify({ text, color, userId, cardId }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Label added successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to add label");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const removeLabel = (labelId) => {
    const userId = props.userId;
    console.log({ labelId, userId });

    fetch("http://spring90.dothome.co.kr/deletelabel.php", {
      method: "POST",
      body: JSON.stringify({ labelId, userId }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Label removed successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to remove label");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const addTask = (value, cardId) => {
    const user_id = props.userId;
    const card_id = cardId;
    const completed = 0;

    console.log(user_id, card_id, value, completed);

    fetch("http://spring90.dothome.co.kr/addTask.php", {
      method: "POST",
      body: JSON.stringify({ user_id, card_id, text: value, completed }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          props.fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Task added successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to add task");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const removeTask = (id) => {
    const userId = props.userId;
    console.log({ id, userId });

    fetch("http://spring90.dothome.co.kr/deleteTask.php", {
      method: "POST",
      body: JSON.stringify({ id, userId }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          props.fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Task removed successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to remove Task");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const updateTask = (id, completed) => {
    const user_id = props.userId;
    const tempcompleted = (completed) => (completed == 1 ? 1 : 0);
    const task_completed = tempcompleted(completed);

    console.log(user_id, task_completed);

    fetch("http://spring90.dothome.co.kr/updateTask.php", {
      method: "POST",
      body: JSON.stringify({ id, user_id, task_completed }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          console.log("updated task");
          props.fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Task added successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to add task");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const updateTitle = (title, cardId) => {
    const user_id = props.userId;

    console.log(title, cardId);

    fetch("http://spring90.dothome.co.kr/updateTitle.php", {
      method: "POST",
      body: JSON.stringify({ cardId, user_id, title }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          console.log("updated task");
          props.fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Task added successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to add task");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const updateDesc = (desc, cardId) => {
    const user_id = props.userId;

    console.log(desc, cardId);

    fetch("http://spring90.dothome.co.kr/updateDesc.php", {
      method: "POST",
      body: JSON.stringify({ desc, cardId, user_id }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          console.log("updated task");
          props.fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("Task added successfully");
          props.fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to add task");
        }
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  useEffect(() => {
    if (
      values.card_title === props.card?.card_title &&
      values.card_date === props.cards?.card_date &&
      values.card_desc === props.cards?.card_desc &&
      values.tasks === props.cards?.tasks.task_completed &&
      values.tasks === props.cards?.tasks.task_text &&
      values.labels?.length === props.card?.labels?.length &&
      values.tasks?.length === props.card?.tasks?.length
    )
      return;
    props.updateCard(props.card.card_id, props.boardId, values);
  }, [values]);

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" centered>
      <Container>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            Title
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={card_title}
              default={card_title}
              placeholder="Enter Title"
              buttonText="Set Title"
              fetchEventsFromServer={props.fetchEventsFromServer}
              onSubmit={(value) => updateTitle(value, props.card.card_id)}
            />
          </div>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            Description
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={card_desc}
              default={card_desc}
              placeholder="Enter Description"
              buttonText="Set Description"
              onSubmit={(value) => updateDesc(value, props.card.card_id)}
            />
          </div>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            D-Date
          </div>
          <div className="cardinfo_box_body">
            <p>{card_date}</p>
          </div>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            Labels
          </div>
          <div className="cardinfo_box_labels">
            {labels?.map((item, index) => (
              <Chip
                close
                onClose={() => removeLabel(item.label_id)}
                key={item.label_text + index}
                color={item.label_color}
                text={item.label_text}
              />
            ))}
          </div>
          <div className="cardinfo_box_colors">
            {colors.map((item, index) => (
              <li
                key={index}
                style={{ backgroundColor: item }}
                className={item === activeColor ? "active" : ""}
                onClick={() => setActiveColor(item)}
              />
            ))}
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text="Add Label"
              placeholder="Enter Label"
              buttonText="Add Label"
              onSubmit={(value) =>
                addLabel(value, activeColor, props.card.card_id)
              }
            />
          </div>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            Tasks
          </div>

          <div className="cardinfo_box_progress-bar">
            <div
              className={`cardinfo_box_progress`}
              style={{
                width: calculatePercent() + "%",
                backgroundColor: calculatePercent() == "100" ? "limegreen" : "",
              }}
            />
          </div>

          <div className="cardinfo_box_list">
            {tasks?.map((item) => (
              <div key={item.task_id} className="cardinfo_task">
                <input
                  type="checkbox"
                  defaultChecked={item.task_completed == 1}
                  onChange={(event) =>
                    updateTask(item.task_id, event.target.checked)
                  }
                />
                <p>{item.task_text}</p>
                <Trash onClick={() => removeTask(item.task_id)} />
              </div>
            ))}
          </div>

          <div className="cardinfo_box_body">
            <Editable
              text="Add New Task"
              placeholder="Enter Task"
              buttonText="Add Task"
              onSubmit={(value) => addTask(value, props.card.card_id)}
            />
          </div>
        </div>
      </div>
      </Container>
    </Modal>
  );
};

export default Cardinfo;
