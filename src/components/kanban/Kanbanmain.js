import React, { useEffect, useState } from "react";
import Board from "./Board/Board";
import Editable from "./Editable/Editable";
//'./components/Editable/Editable';

//import { NavBar } from './components/NavBar';
//import 'bootstrap/dist/css/bootstrap.min.css';

export const Kanbanmain = ({ userId }) => {
  const [boards, setBoards] = useState([]);
  //const [responseMessage, setResponseMessage] = useState("");
  const [cid, setCid] = useState("");
  const [bid, setBid] = useState("");
  const hasTodoBoard = boards.some((item) => item.kanban_title === "ToDo");
  const addBoard = (title) => {
    const eventData = {
      user_id: userId,
      title: title,
    };

    console.log("Data being sent to the server:", JSON.stringify(eventData));

    // Send data to the server
    fetch("http://spring90.dothome.co.kr/addboard.php", {
      method: "POST",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json", // Changed content type to JSON
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.message);
        } else {
          fetchEventsFromServer();
        }
      })
      .catch((error) => console.error("Error creating event:", error));
  };

  const removeBoard = (bid) => {
    const tempBoards = boards.filter((item) => item.id !== bid);
    setBoards(tempBoards);
  };

  useEffect(() => {
    // This code will run after each render when cid or bid is updated
    console.log("End:", cid);
    console.log("Enter:", bid);
    cardUpdateBoard();
  }, [cid, bid]); // Specify cid and bid as dependencies

  const handleDragEnd = (cardId, boardId) => {
    setCid(cardId);
  };

  const handleDragEnter = (cardId, boardId) => {
    setBid(boardId);
  };

  const initialization = () => {
    setBid("");
    setCid("");
  };
  const cardUpdateBoard = () => {
    console.log("Data being sent to the server:", userId, cid, bid);

    // Check if cid and bid have valid values
    if (cid !== null && cid !== "" && bid !== null && bid !== "") {
      // Send data to the server
      fetch("http://spring90.dothome.co.kr/update_card.php", {
        method: "POST",
        body: JSON.stringify({ userId, cid, bid }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "cors",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            console.log("updated board");
            fetchEventsFromServer();
          }
          return response.json();
        })
        .then((data) => {
          console.log(data); // Log the response data for debugging
          if (data.success) {
            console.log("board updated successfully");
            fetchEventsFromServer();
            initialization();
          } else {
            console.error(data.message || "Failed to update board");
            initialization();
          }
        })
        .catch((error) => {
          console.error("Error updating board:", error);
          initialization();
        });
    } else {
      console.error("Invalid values for cid and bid");
    }
  };

  const updateCard = (cid, bid, card) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;

    const cIndex = boards[bIndex].cards.findIndex(
      (item) => item.card_id === cid
    );
    if (cIndex < 0) return;

    const tempBoards = [...boards];
    console.log("Original boards:", boards);

    tempBoards[bIndex].cards[cIndex] = card;
    console.log("Modified tempBoards:", tempBoards);
    console.log("Updated board after modification:", tempBoards[bIndex]);

    setBoards(tempBoards);
    console.log("Final boards after state update:", tempBoards);
  };

  const transformData = (rawData) => {
    return rawData.reduce((result, item) => {
      const existingKanban = result.find(
        (kanban) => kanban.kanban_title === item.kanban_title
      );

      if (!existingKanban) {
        const newKanban = {
          kanban_id: item.kanban_id,
          kanban_title: item.kanban_title,
          cards: [
            {
              card_id: item.card_id,
              card_title: item.card_title,
              labels: item.label_id
                ? [
                    {
                      label_id: item.label_id,
                      label_text: item.label_text,
                      label_color: item.label_color,
                    },
                  ]
                : [],
              tasks: item.task_id
                ? [
                    {
                      task_id: item.task_id,
                      task_text: item.task_text,
                      task_completed: item.task_completed,
                    },
                  ]
                : [],
              card_desc: item.card_desc,
              card_date: item.card_date,
            },
          ],
        };

        result.push(newKanban);
      } else {
        const existingCard = existingKanban.cards.find(
          (card) => card.card_id === item.card_id
        );

        if (!existingCard) {
          existingKanban.cards.push({
            card_id: item.card_id,
            card_title: item.card_title,
            labels: item.label_id
              ? [
                  {
                    label_text: item.label_text,
                    label_color: item.label_color,
                  },
                ]
              : [],
            tasks: item.task_id
              ? [
                  {
                    task_id: item.task_id,
                    task_text: item.task_text,
                    task_completed: item.task_completed,
                  },
                ]
              : [],
            card_desc: item.card_desc,
            card_date: item.card_date,
          });
        } else {
          if (item.label_id) {
            const existingLabel = existingCard.labels.find(
              (label) => label.label_text === item.label_text
            );

            if (!existingLabel) {
              existingCard.labels.push({
                label_text: item.label_text,
                label_color: item.label_color,
              });
            }
          }

          if (item.task_id) {
            const existingTask = existingCard.tasks.find(
              (task) => task.task_id === item.task_id
            );

            if (!existingTask) {
              existingCard.tasks.push({
                task_id: item.task_id,
                task_text: item.task_text,
                task_completed: item.task_completed,
              });
            }
          }
        }
      }

      return result;
    }, []);
  };

  const fetchEventsFromServer = () => {
    // Fetch events from the server and update the state
    fetch("http://spring90.dothome.co.kr/allloadkanban.php", {
      method: "POST",
      body: new URLSearchParams({ userId }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // 데이터 변환 후 상태 업데이트
          const transformedData = transformData(data.events);
          setBoards(transformedData);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const addTodoBoard = () => {
    const id = 0;
    const status = "ToDo";
    console.log("Data being sent to the server:", id, userId, status);
    fetch("http://spring90.dothome.co.kr/createTodo.php", {
      method: "POST",
      body: JSON.stringify({ id, userId, status }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          console.log("updated board");
          fetchEventsFromServer();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data for debugging
        if (data.success) {
          console.log("board updated successfully");
          fetchEventsFromServer();
        } else {
          console.error(data.message || "Failed to update board");
        }
      })
      .catch((error) => {
        console.error("Error updating board:", error);
      });
  };

  useEffect(() => {
    // Fetch events from the server
    fetch("http://spring90.dothome.co.kr/allloadkanban.php", {
      method: "POST",
      body: new URLSearchParams({ userId }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // 데이터 변환 후 상태 업데이트
          const transformedData = transformData(data.events);
          setBoards(transformedData);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [userId]);

  return (
    <div>
      <div className="app_outer">
        {hasTodoBoard ? (
          <div className="app_boards">
            {boards.map((item) => (
              <Board
                key={item.kanban_id}
                board={item}
                userId={userId}
                removeBoard={removeBoard}
                handleDragEnd={handleDragEnd}
                handleDragEnter={handleDragEnter}
                updateCard={updateCard}
                fetchEventsFromServer={fetchEventsFromServer}
              />
            ))}

            <div className="app_boards_board">
              <Editable
                displayClass="app_boards_board_add"
                text="Add Board"
                placeholder="Enter board title"
                onSubmit={(value) => addBoard(value)}
              />
            </div>
          </div>
        ) : (
          <div className="centered">
            <button
              className="create-todo-button"
              onClick={() => addTodoBoard()}
            >
              Create ToDo Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kanbanmain;
