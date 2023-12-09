import React, { useState } from "react";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const userId = props.userId;

  const removeBoard = (boardId) => {
    console.log({ boardId, userId });
    fetch("http://spring90.dothome.co.kr/delete_board.php", {
      method: "POST",
      body: JSON.stringify({ boardId, userId }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        response.json();
        props.fetchEventsFromServer();
      })
      .then((data) => {
        if (!data.success) {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error updating event:", error));
  };
  return (
    <div className="board">
      <div className="board_top">
        <p className="board_top_title">
          {props.board?.kanban_title}
          <span>{` ${
            props.board?.cards?.filter((item) => item.card_id !== null)?.length
          }`}</span>
        </p>
        <div
          className="board_top_more"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown onClose={() => setShowDropdown(false)}>
              <div className="board_dropdown">
                <p onClick={() => removeBoard(props.board?.kanban_id)}>
                  Delete Board
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {props.board?.cards && props.board.cards.length > 0 ? (
          props.board.cards.map((item) => (
            <Card
              key={item.card_id}
              card={item}
              userId={props.userId}
              boardId={props.board?.kanban_id}
              handleDragEnd={props.handleDragEnd}
              handleDragEnter={props.handleDragEnter}
              updateCard={props.updateCard}
              fetchEventsFromServer={props.fetchEventsFromServer}
            />
          ))
        ) : (
          <p>No cards available.</p>
        )}
      </div>
    </div>
  );
}

export default Board;
