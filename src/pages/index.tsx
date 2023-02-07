import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";

const taskRepo = remult.repo(Task);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setNewTaskTitle("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
  };

  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") signIn();
    else {
      return taskRepo
        .liveQuery({
          orderBy: {
            completed: "asc",
          },
        })
        .subscribe(({ applyChanges }) => setTasks(applyChanges));
    }
  }, [session]);
  return (
    <div className="bg-gray-50 h-screen flex items-center flex-col justify-center text-lg">
      <h1 className="text-red-500 text-6xl italic">Todos {tasks.length}</h1>
      <main className="bg-white border rounded-lg shadow-lg m-5 w-screen max-w-md">
        <div className="flex justify-between px-6 p-2 border-b">
          Hello {session.data?.user?.name}{" "}
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        <form onSubmit={addTask} className="border-b-2 px-6 p-2 gap-2 flex ">
          <input
            className="w-full"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </form>
        {tasks.map((task) => {
          const setTask = (value: Task) =>
            setTasks(tasks.map((t) => (t === task ? value : t)));

          const setCompleted = async (completed: boolean) => {
            const t = { ...task, completed };
            setTask(t);
            await taskRepo.save(t);
          };

          const setTitle = (title: string) => setTask({ ...task, title });

          const saveTask = async () => {
            try {
              await taskRepo.save(task);
            } catch (err: any) {
              alert(err.message);
            }
          };

          const deleteTask = async () => {
            try {
              await taskRepo.delete(task);
            } catch (err: any) {
              alert(err.message);
            }
          };

          return (
            <div
              key={task.id}
              className="border-b px-6 gap-2 flex items-center p-2"
            >
              <input
                type="checkbox"
                checked={task.completed}
                className="w-6 h-6"
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <input
                value={task.title}
                className="w-full"
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={saveTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
              <button onClick={deleteTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          );
        })}
        <div className="border-t px-6 p-2 gap-4 flex justify-between">
          <button
            className="bg-blue-600 text-white px-3 py-1 font-semibold rounded-lg"
            onClick={() => setAllCompleted(true)}
          >
            Set All Completed
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 font-semibold rounded-lg"
            onClick={() => setAllCompleted(false)}
          >
            Set All UnCompleted
          </button>
        </div>
      </main>
    </div>
  );
}
