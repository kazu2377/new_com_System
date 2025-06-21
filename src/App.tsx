import React, { useState } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App(): React.JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>('')

  const addTodo = (): void => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ])
      setInputValue('')
    }
  }

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const startEditing = (id: number, text: string): void => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = (): void => {
    if (editingId !== null && editingText.trim() !== '') {
      setTodos(
        todos.map(todo =>
          todo.id === editingId ? { ...todo, text: editingText } : todo
        )
      )
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = (): void => {
    setEditingId(null)
    setEditingText('')
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="app">
      <h1>Todo アプリ</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          placeholder="新しいタスクを入力..."
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && addTodo()
          }
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            {editingId === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingText(e.target.value)
                }
                onKeyDown={handleEditKeyDown}
                onBlur={saveEdit}
                autoFocus
                className="edit-input"
              />
            ) : (
              <span
                onClick={() => toggleTodo(todo.id)}
                onDoubleClick={() => startEditing(todo.id, todo.text)}
                className="todo-text"
              >
                {todo.text}
              </span>
            )}
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
