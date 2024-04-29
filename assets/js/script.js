// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++;
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $("<div>").addClass("card task-card mb-3").attr("data-task-id", task.id);
    card.html(`
        <div class="card-header">${task.title}</div>
        <div class="card-body">
            <p class="card-text">${task.taskDescription}</p>
            <p class="card-text">Due Date: ${task.dueDate}</p>
            <button type="button" class="btn btn-danger btn-sm delete-task-btn">Delete</button>
        </div>
    `);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoCards = $("#todo-cards");
    const inProgressCards = $("#in-progress-cards");
    const doneCards = $("#done-cards");

    // Check if the elements exist
    if (!todoCards.length || !inProgressCards.length || !doneCards.length) {
        console.error("One or more task card containers are missing.");
        return;
    }

    todoCards.empty();
    inProgressCards.empty();
    doneCards.empty();

    taskList.forEach(task => {
        const card = createTaskCard(task);
        if (task.status === "todo") {
            todoCards.append(card);
        } else if (task.status === "inProgress") {
            inProgressCards.append(card);
        } else if (task.status === "done") {
            doneCards.append(card);
        }
    });

    $(".task-card").draggable({
        revert: "invalid",
        stack: ".task-card",
        helper: "clone"
    });

    $(".delete-task-btn").click(handleDeleteTask);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const title = $("#title").val();
    const dueDate = $("#dueDate").val();
    const taskDescription = $("#taskDescription").val();
    const id = generateTaskId();

    const newTask = {
        id,
        title,
        dueDate,
        taskDescription,
        status: "todo"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);

    $('#formModal').modal('hide');

    renderTaskList();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).closest(".task-card").data("taskId");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("data-task-id");
    const newStatus = $(this).attr("id");

    // Find the task in the taskList array
    const taskIndex = taskList.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        // Update the status of the task
        taskList[taskIndex].status = newStatus;

        // Save the updated task list to localStorage
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // Re-render the task list
        renderTaskList();
    }
    ui.draggable.draggable('option', 'revert', false); // Prevents reverting after drop
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Render task list
    renderTaskList();

    // Make lanes droppable
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

    // Initialize date picker
    $("#dueDate").datepicker();

    $("#formModal button.btn-primary").click(handleAddTask);
});
