import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Todo アプリ', () => {
  it('アプリのタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('Todo アプリ')).toBeInTheDocument()
  })

  it('入力フィールドとボタンが表示される', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument()
    expect(screen.getByText('追加')).toBeInTheDocument()
  })

  it('新しいタスクを追加できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')
    
    await user.type(input, 'テストタスク')
    await user.click(addButton)
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('Enterキーでタスクを追加できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    
    await user.type(input, 'Enterキーテスト')
    await user.keyboard('{Enter}')
    
    expect(screen.getByText('Enterキーテスト')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('空のタスクは追加されない', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const addButton = screen.getByText('追加')
    const todoList = screen.getByRole('list')
    
    await user.click(addButton)
    
    expect(todoList).toBeEmptyDOMElement()
  })

  it('タスクをクリックして完了状態を切り替えられる', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')
    
    await user.type(input, '完了テスト')
    await user.click(addButton)
    
    const todoItem = screen.getByText('完了テスト')
    const listItem = todoItem.closest('li')
    
    expect(listItem).not.toHaveClass('completed')
    
    await user.click(todoItem)
    
    expect(listItem).toHaveClass('completed')
  })

  it('タスクを削除できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')
    
    await user.type(input, '削除テスト')
    await user.click(addButton)
    
    expect(screen.getByText('削除テスト')).toBeInTheDocument()
    
    const deleteButton = screen.getByText('削除')
    await user.click(deleteButton)
    
    expect(screen.queryByText('削除テスト')).not.toBeInTheDocument()
  })

  it('複数のタスクを管理できる', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')
    
    await user.type(input, 'タスク1')
    await user.click(addButton)
    
    await user.type(input, 'タスク2')
    await user.click(addButton)
    
    await user.type(input, 'タスク3')
    await user.click(addButton)
    
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.getByText('タスク3')).toBeInTheDocument()
    
    const deleteButtons = screen.getAllByText('削除')
    expect(deleteButtons).toHaveLength(3)
  })

  it('スペースだけの入力は追加されない', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')
    const todoList = screen.getByRole('list')
    
    await user.type(input, '   ')
    await user.click(addButton)
    
    expect(todoList).toBeEmptyDOMElement()
  })
})