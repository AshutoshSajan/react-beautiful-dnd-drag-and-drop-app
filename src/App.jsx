import React, { useState } from "react";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const tasks = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
  { id: uuid(), content: "Sixth task" }
];

const boards = {
  [uuid()]: {
    name: "Board1",
    items: tasks
  },
  [uuid()]: {
    name: "Board2",
    items: []
  },
  [uuid()]: {
    name: "Board3",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  console.log(result, "result...\n", columns, "columns...\n");

  const { source, destination } = result;
  if (!destination) return;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function App() {
  const [columns, setColumns] = useState(boards);
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%"
      }}
    >
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <h2>{column.name}</h2>
              <Droppable droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      key={id}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgray",
                        padding: 4,
                        width: 250,
                        minHeight: 400,
                        margin: "0 10px"
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    padding: 16,
                                    margin: "0 0 8px 0",
                                    minHeight: "50px",
                                    backgroundColor: snapshot.isDragging
                                      ? "#263b4a"
                                      : "#456c86",
                                    color: "white",
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  {item.content}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
