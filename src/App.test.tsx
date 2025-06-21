import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Todo アプリ', () => {
  it('アプリのタイトルが表示される', () => {
    render(<App />)
    expect(screen.getByText('Todo アプリ')).toBeInTheDocument()
  })

  it('入力フィールドとボタンが表示される', () => {
    render(<App />)
    expect(
      screen.getByPlaceholderText('新しいタスクを入力...')
    ).toBeInTheDocument()
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

  it('ダブルクリックでタスクを編集モードにできる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')

    await user.type(input, '編集テスト')
    await user.click(addButton)

    const todoText = screen.getByText('編集テスト')
    await user.dblClick(todoText)

    const editInput = screen.getByDisplayValue('編集テスト')
    expect(editInput).toBeInTheDocument()
    expect(editInput).toHaveFocus()
  })

  it('編集モードでEnterキーを押すと編集が完了する', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')

    await user.type(input, '編集前テキスト')
    await user.click(addButton)

    const todoText = screen.getByText('編集前テキスト')
    await user.dblClick(todoText)

    const editInput = screen.getByDisplayValue('編集前テキスト')
    await user.clear(editInput)
    await user.type(editInput, '編集後テキスト')
    await user.keyboard('{Enter}')

    expect(screen.getByText('編集後テキスト')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('編集後テキスト')).not.toBeInTheDocument()
  })

  it('編集モードでEscapeキーを押すと編集がキャンセルされる', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')

    await user.type(input, 'キャンセルテスト')
    await user.click(addButton)

    const todoText = screen.getByText('キャンセルテスト')
    await user.dblClick(todoText)

    const editInput = screen.getByDisplayValue('キャンセルテスト')
    await user.clear(editInput)
    await user.type(editInput, '変更内容')
    await user.keyboard('{Escape}')

    expect(screen.getByText('キャンセルテスト')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('変更内容')).not.toBeInTheDocument()
  })

  it('編集モードでフォーカスを失うと編集が完了する', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')

    await user.type(input, 'ブラーテスト')
    await user.click(addButton)

    const todoText = screen.getByText('ブラーテスト')
    await user.dblClick(todoText)

    const editInput = screen.getByDisplayValue('ブラーテスト')
    await user.clear(editInput)
    await user.type(editInput, 'ブラー後テキスト')
    
    await user.click(addButton)

    expect(screen.getByText('ブラー後テキスト')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('ブラー後テキスト')).not.toBeInTheDocument()
  })

  it('編集モードで空のテキストを保存しようとすると元のテキストが保持される', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('新しいタスクを入力...')
    const addButton = screen.getByText('追加')

    await user.type(input, '空文字テスト')
    await user.click(addButton)

    const todoText = screen.getByText('空文字テスト')
    await user.dblClick(todoText)

    const editInput = screen.getByDisplayValue('空文字テスト')
    await user.clear(editInput)
    await user.keyboard('{Enter}')

    expect(screen.getByText('空文字テスト')).toBeInTheDocument()
  })
})
