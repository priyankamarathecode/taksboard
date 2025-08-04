// src/pages/user/MyTasks.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statusTypes = ["To Do", "In Progress", "Complete"];

const getInitialColumns = () => ({
  "To Do": { name: "To Do", color: "bg-blue-100", items: [] },
  "In Progress": { name: "In Progress", color: "bg-yellow-100", items: [] },
  Complete: { name: "Complete", color: "bg-green-100", items: [] },
});

const MyTasks = () => {
  const [columns, setColumns] = useState(getInitialColumns());

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      const updatedColumns = getInitialColumns(); // 🔁 Reset column items

      res.data.forEach((task) => {
        const status = statusTypes.includes(task.status)
          ? task.status
          : "To Do";
        updatedColumns[status].items.push(task);
      });

      setColumns(updatedColumns);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [movedTask] = sourceItems.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destItems.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems },
    });

    try {
      await API.put(`/tasks/${movedTask._id}`, { status: movedTask.status });
      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📌 My Tasks Board
      </h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([colId, col]) => (
            <div key={colId} className="bg-white rounded-lg shadow-md p-4">
              <h3
                className={`text-xl font-semibold mb-4 p-2 ${col.color} rounded`}
              >
                {col.name}
              </h3>
              <Droppable droppableId={colId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px] space-y-3"
                  >
                    {col.items.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 border hover:shadow-md transition rounded p-3"
                          >
                            <h4 className="font-bold text-gray-800">
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Due:{" "}
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString()
                                : "No deadline"}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {col.items.length === 0 && (
                      <p className="text-gray-400 text-sm text-center mt-2">
                        No tasks
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MyTasks;
