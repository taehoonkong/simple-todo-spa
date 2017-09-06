(function (window, document) {

  /**
   * 서버에서 할일 템플릿과 할일 데이터를 가져온 후, #todos 요소 안에 렌더링하는 함수
   */
  function loadTodos() {
    console.log('start loadTodos')
    render({
      target: '#todos',
      templatePath: '/templates/todos.ejs',
      dataPath: '/api/todos'
    }).then(todosEl => {
      todosEl.querySelectorAll('.todo-item').forEach(todoItem => {
        const id = todoItem.dataset.id // <div data-id="1"></div> : dataset.id = "1"

        // 체크박스 클릭시
        // 낙관적 업데이트
        // 화면 갱신과 ajax요청을 같은 단계에서
        const checkboxEl = todoItem.querySelector('.todo-checkbox')
        checkboxEl.addEventListener('click', e => {
          axios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }).then(res => {
            loadTodos()
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트
        // 성공 실패를 가늠할 수 없기 때문
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          axios.delete(`/api/todos/${id}`).then(res => {
            loadTodos()
          })
        })
      })
    })
  }

  document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault()
    const form = e.currentTarget
    axios.post('/api/todos', {
      title: form.elements.title.value
    })
      .then(loadTodos)
      .then(() => {
        form.elements.title.value = null
      })
  })

  loadTodos()

})(window, document)
