// Task type definition
type Task = {
    id: number;
    title: string;
    description: string;
    time: string;
    date: string;
    completed: boolean;
};

// Array to store tasks
const tasks: Task[] = loadTasksFromLocalStorage(); // Load tasks from local storage

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage(): Task[] {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to handle navigation and route changes
function navigateTo(event: Event, path: string) {
    event.preventDefault();
    window.location.hash = path; // Use hash navigation
    handleLocation(); // Load the appropriate content
}

// Define the routes and their corresponding content loaders
const routes: { [key: string]: () => void } = {
    "": loadCreateTaskPage, // Updated to '' for the home route
    "/dashboard": loadDashboardPage,
};

// Function to handle loading content based on the current location
function handleLocation() {
    const path = window.location.hash.replace("#", ""); // Use hash and remove the '#' symbol
    const route = routes[path]; // Find the corresponding route function
    if (route) {
        route(); // Load the content for the route
    } else {
        loadCreateTaskPage(); // Fallback to the default page
    }
}

// Function to load the 'Create Task' page content
function loadCreateTaskPage() {
    const viewContainer = document.getElementById("view-container");
    if (viewContainer) {
        viewContainer.innerHTML = `
        <form id="taskForm" class="mt-[30px]">
            <div>
                <h2 class="text-xl font-medium">Create a task!</h2>
                <div>
                    <input type="text" id="taskTitle" class="w-[568px] h-[40px] rounded-3xl mt-[10px] pl-4" placeholder="Write the title" required>
                    <input type="text" id="taskDescription" class="w-[568px] h-[80px] rounded-3xl mt-[10px] pl-4" placeholder="Write a description" required>
                </div>
                <div class="mt-[30px] px-[111px] flex justify-between">
                    <input type="time" id="taskTime" class="bg-gray-500 w-[163px] h-[50px] rounded-2xl" required>
                    <input type="date" id="taskDate" class="bg-gray-500 w-[163px] h-[50px] rounded-2xl" required>
                </div>
                <div class="flex justify-center">
                    <button type="submit" class="w-[162px] h-[70px] mt-[73.25px] bg-gray-500 flex items-center justify-center rounded-2xl">Create</button>
                </div>
            </div>
        </form>
        `;

        // Handle form submission to add a new task
        const taskForm = document.getElementById("taskForm");
        taskForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = (document.getElementById("taskTitle") as HTMLInputElement).value;
            const description = (document.getElementById("taskDescription") as HTMLInputElement).value;
            const time = (document.getElementById("taskTime") as HTMLInputElement).value;
            const date = (document.getElementById("taskDate") as HTMLInputElement).value;

            const newTask: Task = {
                id: Date.now(), // Generate a unique ID
                title,
                description,
                time,
                date,
                completed: false
            };

            addTask(newTask); // Add task to the list
            navigateTo(e, "/dashboard"); // Navigate to dashboard after adding the task
        });
    }
}

// Function to add a task to the list
function addTask(task: Task) {
    tasks.push(task);
    saveTasksToLocalStorage(); // Save tasks to local storage
}

// Function to remove a task from the list
function removeTask(taskId: number) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasksToLocalStorage(); // Save updated tasks to local storage
        updateTaskCounts(); // Update task counts dynamically
    }
}

// Function to load the 'Dashboard' page content
function loadDashboardPage() {
    const viewContainer = document.getElementById("view-container");
    if (viewContainer) {
        const currentDate = new Date();

        // Categorize tasks
        const expiredTasks = tasks.filter(
            (task) => !task.completed && new Date(task.date) < currentDate
        );
        const notDoneTasks = tasks
            .filter((task) => !task.completed && new Date(task.date) >= currentDate)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const doneTasks = tasks.filter((task) => task.completed && new Date(task.date) >= currentDate);

        viewContainer.innerHTML = `
        <div id="upper-part" class="flex mt-[20px]">
            <div id="tasks-left">
                <h2 class="text-xl font-medium flex">You have ${notDoneTasks.length + expiredTasks.length} tasks left to do.</h2>
            </div>
            <div id="status" class="flex ml-[20px]">
                <div id="all-status" class="flex mr-[60px]">
                    <p class="text-lg font-normal mr-[3px]">All</p>
                    <p class="text-lg font-normal">${tasks.length}</p>
                </div>
                <div id="done-status">
                    <div class="flex">
                        <p class="text-lg font-normal mr-[5px]">Done</p><p class="text-lg font-normal">${doneTasks.length}</p>
                    </div>
                    <div class="flex mt-[10px]">
                        <p class="text-lg font-normal mr-[5px]">Not Done</p><p class="text-lg font-normal">${notDoneTasks.length + expiredTasks.length}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="dashboard-view" class="overflow-y-auto max-h-[calc(100vh-150px)] mt-[20px]">
            <h3>Expired Tasks</h3>
            <ul id="expiredTaskList" class="mt-[20px]"></ul>
            <h3>Not Yet Done Tasks (Latest First)</h3>
            <ul id="notDoneTaskList" class="mt-[20px]"></ul>
            <h3>Tasks Done</h3>
            <ul id="doneTaskList" class="mt-[20px]"></ul>
        </div>
        `;

        // Display expired tasks on the dashboard
        const expiredTaskList = document.getElementById("expiredTaskList");
        expiredTasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item p-[10px] border-b border-gray-300 flex items-center justify-between";
            taskItem.innerHTML = `
            <div>
                <h4 class="text-lg font-medium">${task.title}</h4>
                <p class="text-sm text-gray-600">${task.description}</p>
                <p class="text-sm text-red-500">${task.time} on ${task.date}</p>
            </div>
            <button class="remove-task-button ml-auto bg-red-500 text-white px-3 py-1 rounded-lg">Remove</button>
            `;
            expiredTaskList?.appendChild(taskItem);

            // Handle the "Remove" button click
            const removeButton = taskItem.querySelector('.remove-task-button');
            removeButton?.addEventListener('click', () => {
                removeTask(task.id);
                loadDashboardPage(); // Reload the dashboard page after removal
            });
        });

        // Display not done tasks on the dashboard
        const notDoneTaskList = document.getElementById("notDoneTaskList");
        notDoneTasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item p-[10px] border-b border-gray-300 flex items-center justify-between";
            taskItem.innerHTML = `
            <div>
                <h4 class="text-lg font-medium">${task.title}</h4>
                <p class="text-sm text-gray-600">${task.description}</p>
                <p class="text-sm text-gray-500">${task.time} on ${task.date}</p>
            </div>
            <button class="mark-done-button ml-auto bg-green-500 text-white px-3 py-1 rounded-lg">Mark as Done</button>
            <button class="remove-task-button ml-2 bg-red-500 text-white px-3 py-1 rounded-lg">Remove</button>
            `;
            notDoneTaskList?.appendChild(taskItem);

            // Handle the "Mark as Done" button click
            const markDoneButton = taskItem.querySelector('.mark-done-button');
            markDoneButton?.addEventListener('click', () => {
                markTaskAsDone(task.id);
                loadDashboardPage(); // Reload the dashboard page after marking as done
            });

            // Handle the "Remove" button click
            const removeButton = taskItem.querySelector('.remove-task-button');
            removeButton?.addEventListener('click', () => {
                removeTask(task.id);
                loadDashboardPage(); // Reload the dashboard page after removal
            });
        });

        // Display done tasks on the dashboard
        const doneTaskList = document.getElementById("doneTaskList");
        doneTasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item p-[10px] border-b border-gray-300 flex items-center justify-between";
            taskItem.innerHTML = `
            <div>
                <h4 class="text-lg font-medium">${task.title}</h4>
                <p class="text-sm text-gray-600">${task.description}</p>
                <p class="text-sm text-gray-500">${task.time} on ${task.date}</p>
            </div>
            <button class="remove-task-button ml-auto bg-red-500 text-white px-3 py-1 rounded-lg">Remove</button>
            `;
            doneTaskList?.appendChild(taskItem);

            // Handle the "Remove" button click
            const removeButton = taskItem.querySelector('.remove-task-button');
            removeButton?.addEventListener('click', () => {
                removeTask(task.id);
                loadDashboardPage(); // Reload the dashboard page after removal
            });
        });
    }
}

// Function to mark a task as done
function markTaskAsDone(taskId: number) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = true;
        saveTasksToLocalStorage(); // Save updated tasks to local storage
        updateTaskCounts(); // Update task counts dynamically
    }
}

// Function to update task counts
function updateTaskCounts() {
    const currentDate = new Date();

    const expiredTasks = tasks.filter(
        (task) => !task.completed && new Date(task.date) < currentDate
    );
    const notDoneTasks = tasks.filter(
        (task) => !task.completed && new Date(task.date) >= currentDate
    );
    const doneTasks = tasks.filter((task) => task.completed && new Date(task.date) >= currentDate);

    // Update the counts on the dashboard
    const tasksLeftElement = document.querySelector("#tasks-left h2");
    const allStatusElement = document.querySelector("#all-status p:nth-of-type(2)");
    const doneStatusElement = document.querySelector("#done-status p:nth-of-type(2)");
    const notDoneStatusElement = document.querySelector("#done-status p:nth-of-type(4)");

    if (tasksLeftElement && allStatusElement && doneStatusElement && notDoneStatusElement) {
        tasksLeftElement.textContent = `You have ${notDoneTasks.length + expiredTasks.length} tasks left to do.`;
        allStatusElement.textContent = `${tasks.length}`;
        doneStatusElement.textContent = `${doneTasks.length}`;
        notDoneStatusElement.textContent = `${notDoneTasks.length + expiredTasks.length}`;
    }
}

// Handle initial page load
handleLocation();
