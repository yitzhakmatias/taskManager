import { useState, type FormEvent } from "react";

type TaskInputProps = {
  onAddTask: (text: string) => void;
};

function TaskInput(props: TaskInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (trimmedText === "") {
      return;
    }

    props.onAddTask(trimmedText);
    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Escribe una nueva tarea"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default TaskInput;
