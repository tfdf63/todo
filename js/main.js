//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

//Добавление задачи
form.addEventListener('submit', addTask);

//Удаление задачи
//В разметке к тегу img добавленно свойство pointer-events: none, которое позволяет при клике на кнопку/картинку удалить, срабатывает событие не по img, а по button
//У кнопок добавлены атрибуты data-action="delete" и data-action="done"
tasksList.addEventListener('click', deleteTask);

//Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

//[#1 Оставил блок на память] Сохраняем разметку и рендерим её на сайт
// if (localStorage.getItem('tasksHTML')) {
//     tasksList.innerHTML = localStorage.getItem('tasksHTML');
// }

//Функции
function addTask(event) {
    //Отменяем обновление после отправки фомры
    event.preventDefault();

    //Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    //Добавляем задачу в массив с задачами
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    //Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = '';
    taskInput.focus();

    // //Если в списке задач более 1 элемента, то пропадает блок "Список задач пуст"
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }

    //[#1
    //saveHTMLtoLS();

    checkEmptyList();
}

function deleteTask(event) {
    //Проверяем если кли был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    const parenNode = event.target.closest('.list-group-item'); //Ищем родительскую ноду

    //Определяем ID задачи
    const id = Number(parenNode.id);

    //Находим индекс задачи в массиве
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();

    //Удалаяем задачу из массива с задачами
    // tasks.splice(index, 1);

    //Второй способ удаления. Через фильтрацию массива
    //tasks = tasks.filter((task) => task.id === id);

    parenNode.remove(); //удаляет родительскую ноду со страницы

    // if (tasksList.children.length == 1) {
    //     emptyList.classList.remove('none');
    // }

    //[#1
    //saveHTMLtoLS();

    checkEmptyList();
}

function doneTask(event) {
    //Проверяем если кли был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== "done") return;

    //Проверяем, что клик был по кнопке "задача выполнена
    const parenNode = event.target.closest('.list-group-item');

    //Определяем id задачи
    const id = Number(parenNode.id);

    const task = tasks.find((task) => task.id === id);

    // const task = tasks.find(function (task) { //Метод find передаёт ссылку на объект
    //     if (task.id === id) {                 //Был такой код, упростили и записали на 116
    //         return true;
    //     }
    // });

    task.done = !task.done; //Поменяли done с true на false

    saveToLocalStorage();

    const taskTitle = parenNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    //[#1
    //saveHTMLtoLS();
}

//length сообщает количество элементов в массиве
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null; //Тернарный оператор
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    //Формируем CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    //Формируем разметку для новой задачи
    const taskHTML = `
            <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                <span class="${cssClass}">${task.text}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
            </li>`;

    //Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
//[#1 Оставил блок на память] Сохраняем разметку и рендерим её на сайт
// function saveHTMLtoLS() {
//     localStorage.setItem('tasksHTML', tasksList.innerHTML);
// }

