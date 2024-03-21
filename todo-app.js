(function() {
  let todoListArr = [];
  let listName = '';

  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // поле ввода
  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append'); // позиционирование справа от поля для ввода
    button.classList.add('btn', 'btn-primary');
    button.disabled = true;
    button.textContent = 'Добавить дело';

    // установить атрибут disabled
    input.addEventListener('input', function() {
      if (input.value !== "") {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // список элементов
  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }


  // элементы списка и кнопки: готово, удалить
  function createTodoItem(obj) {
    const item = document.createElement('li');

    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    // стилизовать элементы списка и разместить кнопки справа
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    if (obj.done == true) item.classList.add('list-group-item-success');

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';


    // кнопка Готово (изменить статус)
    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
      // для массива изменить значение done
      for (const arrItem of todoListArr) {
        if (arrItem.id == obj.id) {
          arrItem.done = !arrItem.done;
        }
      }
      saveLocalData(todoListArr, listName);
    });

    // кнопка Удалить
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
        // удаление из массива
        for (i = 0; i < todoListArr.length; i++) {
          if (todoListArr[i].id == obj.id) {
            todoListArr.splice(i, 1); // начиная с индекса i, удалить 1 элемент
          }
        }
        saveLocalData(todoListArr, listName);
      }
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  // найти максимальный id в массиве дел и прибавить к максимальному id число 1
  function createNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  // Local Storage: array to string
  function saveLocalData(arr, key) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function getLocalData() {
    const localData = localStorage.getItem(listName);
    // проверка на наличие данных в localStorage. Если в localStorage есть данные, то расшифровать
    if ((localData !== null) && (localData !== '')) {
      todoListArr = JSON.parse(localData); // string to array
    }
    return localData;
  }


  // создать единый шаблон для списков
  function createTodoApp (container, title = 'Список дел', key, defaultArr = []) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList(); // ul

    listName = key;
    todoListArr = defaultArr; // default list values


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    getLocalData(); // localStorage.getItem

    for (const elem of todoListArr) {
      const todoItem = createTodoItem(elem);
      todoList.append(todoItem.item);
    }

    console.log(todoListArr);


    todoItemForm.form.addEventListener('submit', function(e) {
      // отменить действие по умолчанию - перезагрузку страницы при отправке формы
      e.preventDefault();
      // игнорировать создание элемента, если пользователь ничего не ввёл в поле
      if(!todoItemForm.input.value) {
        return;
      }

      const itemData = {
        id: createNewId(todoListArr),
        name: todoItemForm.input.value,
        done: false,
      }

      const todoItem = createTodoItem(itemData); // в li передаём значение input формы -- object

      todoListArr.push(itemData);

      saveLocalData(todoListArr, listName);

      todoList.append(todoItem.item);

      // очищаем поле для ввода
      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
