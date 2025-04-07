import { useState, useEffect } from "react";
import "./styles/global.css";
import { IoMdAdd } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

function App() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [taskModalState, setTaskModalState] = useState({ task: null, table: null });
  const [tableModalState, setTableModalState] = useState(null);
  const [tables, setTables] = useState(() => {
    const storedTables = localStorage.getItem("tables");
    return storedTables
      ? JSON.parse(storedTables)
      : [
          {
            id: 1,
            name: "Example",
            tasks: [
              {
                id: 1,
                name: "Task example",
                time: "8:00 AM - 8:00 PM",
                color: "#fff",
                checkbox: false,
                description: "Description example",
              },
              {
                id: 2,
                name: "Task example",
                time: "8:00 AM - 8:00 PM",
                color: "#fff",
                checkbox: true,
                description: "Description example",
              },
            ],
          },
        ];
  });

  useEffect(() => {
    if (taskModalState.task !== null && tableModalState !== null) {
      setTableModalState(null);
    }
  }, [taskModalState]);

  useEffect(() => {
    if (taskModalState.task !== null && tableModalState !== null) {
      setTaskModalState({ task: null, table: null });
    }
  }, [tableModalState]);

  const saveTablesToLocalStorage = (data) => {
    localStorage.setItem("tables", JSON.stringify(data));
  };

  useEffect(() => {
    saveTablesToLocalStorage(tables);
  }, [tables]);

  const handleDeleteTable = (tableId) => {
    setTables(tables.filter((table) => table.id !== tableId));
  };

  const handleDeleteTask = (tableId, taskId) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            tasks: table.tasks.filter((task) => task.id !== taskId),
          };
        }
        return table;
      }),
    );
  };

  const handleAddTable = () => {
    setTables([
      ...tables,
      {
        id: tables.length + 1,
        name: "New Table",
        tasks: [],
      },
    ]);
  };

  const handleAddTask = (tableId, taskData) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            tasks: [
              ...table.tasks,
              {
                id: table.tasks.length + 1,
                name: taskData.title,
                time: taskData.time,
                color: taskData.color,
                checkbox: false,
                description: taskData.description,
              },
            ],
          };
        }
        return table;
      }),
    );
  };

  const openTaskModal = (selectTable) => {
    setIsOpenModal(true);
    setSelectedTable(selectTable);
  };

  const handleTableNameChange = (tableId, newName) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return { ...table, name: newName };
        }
        return table;
      }),
    );
  };

  const handleCheckboxChange = (tableId, taskId) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            tasks: table.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  checkbox: !task.checkbox,
                };
              }
              return task;
            }),
          };
        }
        return table;
      }),
    );
  };

  return (
    <div className="custom-scrollbar relative h-screen w-screen overflow-x-auto overflow-y-hidden p-4 text-[var(--color-tertiary)]">
      <div className="overflow-y-hidden relative p-0 h-screen w-fit">
        <p className="mb-3 text-2xl font-semibold">Welcome back to YourToDoo!</p>
        <div className="flex flex-row gap-2 pb-4">
          {/* START TABLE */}
          {tables.map((table) => (
            <div key={table.id} className="flex h-fit max-h-[79vh] w-72 flex-col rounded bg-[var(--color-secondary)] shadow-lg">
              <div className="sticky top-0 z-10 flex flex-row items-center bg-[var(--color-secondary)] p-2">
                <input
                  value={table.name}
                  onChange={(e) => handleTableNameChange(table.id, e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      handleTableNameChange(table.id, "No name");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.target.blur();
                  }}
                  className="font-bold bg-transparent outline-none text-1xl"
                />
                <BsThreeDots
                  size={20}
                  className="mr-2 cursor-pointer rounded transition-all duration-300 hover:scale-110 hover:bg-[var(--color-primary)]"
                  onClick={() => setTableModalState(tableModalState === table.id ? null : table.id)}
                />
                {tableModalState === table.id && (
                  <div className="absolute right-0 translate-y-6 z-50 w-32 rounded bg-[var(--color-secondary)] p-2 shadow-lg">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          handleDeleteTable(table.id);
                          setTableModalState(null);
                        }}
                        className="p-1 text-sm font-semibold text-[var(--color-tertiary)] bg-[var(--color-primary)] rounded shadow-md transition-all duration-300
                          cursor-pointer shadow-[var(--color-tertiary)]/50 hover:brightness-125"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                <IoMdAdd
                  size={20}
                  onClick={() => openTaskModal(table.id)}
                  className="cursor-pointer rounded transition-all duration-300 hover:scale-110 hover:bg-[var(--color-primary)]"
                />
              </div>
              <div className="overflow-y-auto flex-1 p-2 pt-0 custom-scrollbar h-fit">
                <div className="flex flex-col gap-2">
                  {table.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex h-fit w-full cursor-pointer flex-row items-start justify-between rounded bg-[var(--color-primary)] p-2 transition-all
                        duration-300 hover:shadow-xl"
                    >
                      <div className="flex flex-col min-w-0">
                        {task.color !== "" && (
                          <div className="mb-1 h-2 rounded-full w-15" style={{ backgroundColor: task.color }}></div>
                        )}

                        <p className="text-[12px] font-semibold truncate">{task.name}</p>
                        {task.description.trim() !== "" && (
                          <BiMenuAltLeft
                            size={20}
                            className="hover:bg-secondary rounded p-0.5 transition-all duration-300 hover:scale-110"
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-2 justify-center items-center w-fit">
                        <div className="relative">
                          <BsThreeDots
                            size={20}
                            className="hover:bg-secondary rounded p-0.5 transition-all duration-300 hover:scale-110"
                            onClick={(e) => {
                              setTaskModalState(
                                taskModalState.task === task.id && taskModalState.table === table.id
                                  ? { task: null, table: null }
                                  : { task: task.id, table: table.id },
                              );
                            }}
                          />
                        </div>
                        <input
                          type="checkbox"
                          className="css-checkbox"
                          checked={task.checkbox}
                          onChange={() => handleCheckboxChange(table.id, task.id)}
                        />
                      </div>
                      {taskModalState.task === task.id && taskModalState.table === table.id && (
                        <div className="absolute translate-x-30 translate-y-6 z-50 w-32 rounded bg-[var(--color-secondary)] p-2 shadow-lg">
                          <div className="flex flex-col gap-1">
                            <button
                              className="p-1 text-sm font-semibold text-[var(--color-tertiary)] bg-[var(--color-primary)] rounded shadow-md transition-all duration-300
                                cursor-pointer shadow-[var(--color-tertiary)]/50 hover:brightness-125"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteTask(table.id, task.id);
                                setTaskModalState({ task: null, table: null });
                              }}
                              className="p-1 text-sm font-semibold text-[var(--color-tertiary)] bg-[var(--color-primary)] rounded shadow-md transition-all duration-300
                                cursor-pointer shadow-[var(--color-tertiary)]/50 hover:brightness-125"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* END TABLE */}
          <IoMdAdd
            size={30}
            className="rounded transition-all duration-300 cursor-pointer hover:bg-secondary hover:scale-110"
            onClick={handleAddTable}
          />
        </div>
      </div>
      <footer className="fixed right-0 bottom-0 left-0 w-screen p-4 flex flex-row justify-center items-center text-center text-[10px] pointer-events-none">
        <p className="ml-auto pointer-events-auto">
          Created with ❤️ by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-all duration-300 hover:brightness-150"
            href="https://github.com/Irregulaar"
          >
            Irregular
          </a>{" "}
          on github
        </p>
        <IoMdSettings
          size={30}
          className="ml-auto bg-[var(--color-secondary)] p-1 rounded hover:scale-110 transition-all duration-300 cursor-pointer pointer-events-auto"
        />
      </footer>

      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-[#00000050]">
          <TaskCreateModal onClose={() => setIsOpenModal(false)} onSave={(TaskData) => handleAddTask(selectedTable, TaskData)} />
        </div>
      )}
    </div>
  );
}

function TaskCreateModal({ onClose, onSave }) {
  const [colorOpen, setColorOpen] = useState(false);
  const [color, setColor] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const Colors = [
    "#FF5252", // Rojo
    "#FF9800", // Naranja
    "#FFEB3B", // Amarillo
    "#4CAF50", // Verde
    "#2196F3", // Azul
    "#9C27B0", // Púrpura
    "#795548", // Marrón
    "#607D8B", // Gris azulado
    "#E91E63", // Rosa
    "#00BCD4", // Cian
    "#673AB7", // Violeta
    "#3F51B5", // Índigo
  ];

  const handleSave = () => {
    onSave({ title: title, description: description, time: time, color: color });
    onClose();
  };

  return (
    <div className="z-51 flex h-fit w-[90%] md:w-fit flex-col gap-2 bg-[var(--color-primary)] p-2">
      <div className="flex flex-row justify-between w-full">
        <p className="font-bold">Create task</p>
        <div
          onClick={onClose}
          className="flex flex-row items-center justify-center gap-2 rounded bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]
            cursor-pointer hover:brightness-125 transition-all duration-300"
        >
          Close
        </div>
      </div>

      <div className="self-center mb-3 w-full h-px bg-white"></div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Title</p>
        <div className="flex h-fit w-full flex-row justify-between gap-1 rounded bg-[var(--color-secondary)] p-1">
          <input type="text" className="outline-none" onChange={(e) => setTitle(e.target.value)} />
        </div>

        {descriptionOpen ? (
          <>
            <p className="text-[14px]">Description</p>
            <div className="flex h-fit w-full flex-row justify-between gap-1 rounded bg-[var(--color-secondary)] p-1">
              <input type="text" className="outline-none" onChange={(e) => setDescription(e.target.value)} />
              <div
                onClick={() => {
                  setDescriptionOpen(!descriptionOpen);
                  setDescription("");
                }}
                className="flex cursor-pointer hover:brightness-125 transition-all duration-300 flex-row items-center justify-center gap-1 rounded
                  bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)] text-nowrap"
              >
                <FaMinus size={15} />
                Remove description
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={() => setDescriptionOpen(!descriptionOpen)}
            className="flex cursor-pointer hover:brightness-125 transition-all duration-300 flex-row items-center justify-center gap-1 rounded
              bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]"
          >
            <IoMdAdd size={15} />
            {descriptionOpen ? "Remove description" : "Add description"}
          </div>
        )}

        {/*<div
          className="flex cursor-pointer hover:brightness-125 transition-all duration-300 flex-row items-center justify-center gap-1 rounded
            bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]"
        >
          <IoMdAdd size={15} />
          Add time
        </div> */}
        {!colorOpen ? (
          <div
            onClick={() => setColorOpen(!colorOpen)}
            className="cursor-pointer hover:brightness-125 transition-all duration-300 flex flex-row items-center justify-center gap-1 rounded
              bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]"
          >
            <IoMdAdd size={15} />
            Add color
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
            {Colors.map((color, index) => (
              <div
                key={index}
                className="cursor-pointer w-5 h-5 items-center justify-center flex gap-2 rounded bg-[var(--color-tertiary)] p-1 text-[10px]
                  text-[var(--color-secondary)] hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setColor(color);
                  setSelectedColor(index);
                }}
              >
                {selectedColor === index && <FaCheck size={10} className="text-[var(--color-primary)] text-center" />}
              </div>
            ))}
            <div
              onClick={() => {
                setColorOpen(!colorOpen);
                setSelectedColor(null);
                setColor("");
              }}
              className="cursor-pointer hover:brightness-125 transition-all duration-300 flex flex-row items-center justify-center gap-1 rounded
                bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]"
            >
              <FaMinus size={15} />
              Remove colors
            </div>
          </div>
        )}

        <div className="self-center mb-3 w-full h-px bg-white"></div>
        <div
          onClick={handleSave}
          className="flex flex-row items-center justify-center gap-2 rounded bg-[var(--color-tertiary)] p-1 text-[10px] text-[var(--color-secondary)]
            cursor-pointer hover:brightness-125 transition-all duration-300"
        >
          <FaCheck size={10} />
          Create
        </div>
      </div>
    </div>
  );
}

export default App;
