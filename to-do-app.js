// ELEMENTS 

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const tasksLeft = document.getElementById("tasksLeft");
const completedCount = document.getElementById("completedCount");

const clearCompleted = document.getElementById("clearCompleted");

const filters = document.querySelectorAll(".filter");

//This code is selecting HTML elements from to-do-App.html and storing them in JavaScript variables so l can interact with them later. It doesn't perform any actions by itself—it simply prepares my program to manipulate those elements.

//  DATA

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

//These two lines initialize your application's data when it starts.

//  SAVE 

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


//This function saves my current list of tasks into the browser's Local Storage, so the tasks are still there even after l refresh or close the browser.
//  RENDER 

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);

    }


//This function is responsible for displaying (rendering) tasks on the screen, and optionally filtering them based on their status.



    filteredTasks.forEach(task => {

        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }


//This is a very important part of my task rendering logic,it controls how completed tasks look differently from pending ones.

        card.innerHTML = `
         <div class="task-left">

            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? "checked" : ""}
            >

            <div>

                <h3 class="task-title">${task.title}</h3>

                <div class="task-date">

                    <i class="fa-regular fa-calendar"></i>

                    <span>${task.date}</span>

                </div>

            </div>

        </div>

        <div class="task-right">

            <span class="category ${task.category.toLowerCase()}">
                ${task.category}
            </span>

            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;


//This part is where my task card gets its full visual structure (HTML inside the div). You’re basically building the entire task UI dynamically using a template string.

// Complete Task

        const check = card.querySelector(".task-check");

        check.addEventListener("change", () => {

            task.completed = check.checked;

            saveTasks();

            renderTasks();

        });


//This part is what makes my to-do app interactive (you can mark tasks as done/undone).

// Delete Task

        const deleteBtn = card.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(card);

    });

    updateCounters();
}
//This is the final part of your renderTasks() function, and it handles deleting tasks + displaying everything on the page.

//  COUNTERS

function updateCounters() {

    const pending = tasks.filter(task => !task.completed).length;

    const completed = tasks.filter(task => task.completed).length;

    tasksLeft.textContent = `${pending} task${pending !== 1 ? "s" : ""} left`;

    completedCount.textContent =
        `${completed} of ${tasks.length} tasks completed`;

}
//This is the final part of your renderTasks() function, and it handles deleting tasks + displaying everything on the page.
// ADD TASK

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") return;

    const categories = [
        "Work",
        "Learning",
        "Personal",
        "Health"
    ];

    const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

    const today = new Date();

    const date = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const task = {

        id: Date.now(),

        title,

        completed: false,

        date,

        category: randomCategory

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

}


//This function is the core of adding a new task in your app. It takes user input, builds a task object, and updates everything.

// EVENTS 

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        addTask();

    }

});

//This part connects your UI (buttons + keyboard input) to your addTask() function, so users can add tasks in two ways: clicking or pressing Enter.

// FILTER 

filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});
//This part is your filter system  it lets users switch between All / Pending / Completed tasks and updates the UI instantly.

//CLEAR COMPLETED

clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});
// “Clear Completed Tasks” button logic it removes all finished tasks at once.

// START 

renderTasks();