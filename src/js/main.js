document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggler
  const toggleModeSwitcher = document.querySelector('#header__switch')
  toggleModeSwitcher.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.body.classList.add('light-mode')
    }
  })

  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    toggleModeSwitcher.checked = true

  // Variables
  let demoTodos = [
    { text: 'Complete online Javascript course', completed: true },
    { text: 'Jog around the park 3x', completed: false },
    { text: '10 minutes meditation', completed: false },
    { text: 'Read for 1 hour', completed: false },
    { text: 'Pick up groceries', completed: false },
    { text: 'Complete Todo App on Frontend Mentor', completed: false },
  ]

  // Load todos
  const todoList = document.querySelector('.todos')
  const todosLeft = document.querySelector('.todos-left')
  const loadTodos = () => {
    let todosCopy = demoTodos
    switch (filter_mode) {
      case 'all':
        todosCopy = demoTodos
        break
      case 'active':
        todosCopy = demoTodos.filter((todo) => todo.completed === false)
        break
      case 'completed':
        todosCopy = demoTodos.filter((todo) => todo.completed === true)
        break
      default:
        break
    }
    todoList.innerHTML = null
    todosCopy.forEach((todo, i) => {
      todoList.innerHTML += `<li class='todo' draggable='true'>
    <input id='todo${i}' type='checkbox' ${todo.completed && 'checked'} >
    <label for='todo${i}' class='switch'></label>
    <p class='todo-text'>${todo.text}<span class='delete'></span></p>
    </li>`
      addCheckedMethod()
      addDeleteMethod()
      addDnDMethod()
    })
    const pendingTodos = demoTodos.reduce(
      (acc, todo) => (todo.completed ? acc : acc + 1),
      0
    )
    todosLeft.innerHTML = `${pendingTodos} items left`
  }

  // Add todo
  const addTodoButton = document.querySelector('[for="new-todo"]')
  const newTodo = document.querySelector('.new-todo-text')
  const addTodo = () => {
    if (newTodo.value.length > 0) {
      demoTodos.unshift({ text: newTodo.value, completed: false })
      loadTodos()
    }
  }
  addTodoButton.addEventListener('click', addTodo)
  newTodo.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      addTodo()
      newTodo.value = ''
    }
  })

  // Checked todo
  const addCheckedMethod = () => {
    const todoCheckboxes = document.querySelectorAll('.todos input')
    todoCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function () {
        todoIndex = demoTodos.findIndex(
          (todo) =>
            todo.text ===
            this.nextSibling.nextSibling.nextSibling.nextSibling.innerText
        )
        demoTodos[todoIndex].completed = this.checked
        loadTodos()
      })
    })
  }

  // Delete todo
  const addDeleteMethod = () => {
    const deleteTodoButtons = document.querySelectorAll('.todo-text .delete')
    deleteTodoButtons.forEach((deleteButton) => {
      deleteButton.addEventListener('click', function () {
        demoTodos = demoTodos.filter(
          (todo) => todo.text !== this.parentElement.innerText
        )
        loadTodos()
      })
    })
  }

  // Drag and drop
  const addDnDMethod = () => {
    let dragSrcTodoId = null

    function handleDragStart() {
      this.style.opacity = '0.7'

      dragSrcTodoId = demoTodos.findIndex(
        (todo) => todo.text === this.children[2].innerText
      )
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault()
      }

      e.dataTransfer.dropEffect = 'move'

      return false
    }

    function handleDragEnter() {
      this.classList.add('over')
    }

    function handleDragLeave() {
      this.classList.remove('over')
    }

    function handleDrop(e) {
      const dropTodoId = demoTodos.findIndex(
        (todo) => todo.text === this.children[2].innerText
      )

      if (e.stopPropagation) {
        e.stopPropagation()
      }

      if (dragSrcTodoId != dropTodoId) {
        const tempTodoId = demoTodos[dropTodoId]
        demoTodos[dropTodoId] = demoTodos[dragSrcTodoId]
        demoTodos[dragSrcTodoId] = tempTodoId
        loadTodos()
        todosCopy = [...demoTodos]
      }

      return false
    }

    function handleDragEnd() {
      this.style.opacity = '1'
    }

    const todoItems = document.querySelectorAll('li.todo')
    todoItems.forEach((todoItem) => {
      todoItem.addEventListener('dragstart', handleDragStart, false)
      todoItem.addEventListener('dragenter', handleDragEnter, false)
      todoItem.addEventListener('dragover', handleDragOver, false)
      todoItem.addEventListener('dragleave', handleDragLeave, false)
      todoItem.addEventListener('drop', handleDrop, false)
      todoItem.addEventListener('dragend', handleDragEnd, false)
    })
  }

  // Filter todos
  let filter_mode = 'all'
  const filters = document.querySelectorAll('[name=filter]')
  filters.forEach((filter) => {
    filter.addEventListener('click', function () {
      switch (this.value) {
        case 'all':
          filter_mode = 'all'
          break
        case 'active':
          filter_mode = 'active'
          break
        case 'completed':
          filter_mode = 'completed'
          break
        default:
          break
      }
      loadTodos()
    })
  })

  // Clear completed
  const clearCompletedButton = document.querySelector('.clear')
  clearCompletedButton.addEventListener('click', () => {
    demoTodos = todosCopy = demoTodos.filter((todo) => todo.completed !== true)
    loadTodos()
  })

  loadTodos()
})
