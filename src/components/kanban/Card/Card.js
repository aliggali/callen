import React, { useState } from "react";
import "./Card.css";
import { Clock, CheckSquare, MoreHorizontal } from "react-feather";
import Chip from "../Chip/Chip";
import Dropdown from "../Dropdown/Dropdown";
import Cardinfo from "./Cardinfo/Cardinfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const removeCard = (cardId, boardId, userId) => {
    console.log(
      "Data being sent to the server:",
      JSON.stringify({ cardId, boardId, userId })
    );

    // Send data to the server for deletion
    fetch("http://spring90.dothome.co.kr/delete_card.php", {
      method: "POST",
      body: JSON.stringify({ cardId, boardId, userId }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
    props.fetchEventsFromServer();
  };

  const calculateDday = (targetDate) => {
    const currentDate = new Date();
    console.log("today:", currentDate);
    //console.log("currentDate :", currentDate);
    if (!targetDate) {
      return null; // or handle it in a way that makes sense for your application
    }

    // Parse the targetDate string into a Date object
    const parts = targetDate.split("-");
    console.log("parts :", parts);
    const targetDateObj = new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
    console.log("targetDate :", targetDate);
    // Calculate the difference in days
    const timeDiff = currentDate - targetDateObj;
    console.log("timeDiff :", timeDiff);
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) - 1;
    console.log("daysRemaining :", daysRemaining);
    return daysRemaining;
  };

  const handModalClose = () => {
    setShowModal(false);
    props.fetchEventsFromServer();
  };

  return (
    <>
      {!showDropdown && showModal && (
        <Cardinfo
          card={props.card}
          updateCard={props.updateCard}
          boardId={props.boardId}
          userId={props.userId}
          show={showModal}
          onHide={handModalClose}
          onClose={() => setShowModal(false)}
          fetchEventsFromServer={props.fetchEventsFromServer}
        />
      )}

      <div
        className="card"
        draggable={true}
        onDragEnd={() => {
          const cardId = props.card?.card_id;
          const boardId = props.boardId;
          props.handleDragEnd(cardId, boardId);
          console.log("onDragEnd - Card ID:", cardId, "Board ID:", boardId);
        }}
        onDragEnter={() => {
          const cardId = props.card?.card_id;
          const boardId = props.boardId;
          props.handleDragEnter(cardId, boardId);
          console.log("onDragEnter - Card ID:", cardId, "Board ID:", boardId);
        }}
        onClick={() => setShowModal(true)}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {props.card?.labels?.map((item, index) => (
              <Chip
                key={index}
                text={item.label_text}
                color={item.label_color}
              />
            ))}
          </div>
          {props.card?.card_id !== null ? (
            <div
              className="card_top_more"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreHorizontal />
              {showDropdown && (
                <Dropdown onClose={() => setShowDropdown(!showModal)}>
                  <div className="card_dropdown">
                    <p
                      onClick={removeCard(
                        props.card?.card_id,
                        props.boardId,
                        props.userId
                      )}
                    >
                      Delete Card
                    </p>
                  </div>
                </Dropdown>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="card_title">
          {" "}
          {props.card?.card_id !== null
            ? props.card?.card_title
            : "There are no cards in this board."}
        </div>
        <div className="card_footer">
          {props.card?.card_date && (
            <p>
              <Clock />
              {calculateDday(props.card?.card_date) === 0
                ? "D-DAY"
                : calculateDday(props.card?.card_date) < 0
                ? `D${calculateDday(props.card?.card_date)}`
                : `D+${calculateDday(props.card?.card_date)}`}
            </p>
          )}
          {props.card?.tasks?.length > 0 && (
            <p>
              <CheckSquare />
              {
                props.card?.tasks?.filter((item) => item.task_completed == 1)
                  .length
              }
              /{props.card?.tasks?.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
