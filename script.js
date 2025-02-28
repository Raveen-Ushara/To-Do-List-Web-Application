const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

function fetchTasks() {
    fetch('api.php')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = ''; // Clear existing list
            tasks.forEach((task, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${task}</span>
                    <div>
                      <button class="completeButton">Complete</button>
                      <button class="deleteButton" data-index="${index}">Delete</button>
                    </div>
                `;
                taskList.appendChild(listItem);

                // Complete button functionality
                listItem.querySelector(".completeButton").addEventListener("click", function(){
                    listItem.querySelector("span").classList.toggle("completed");
                });

                // Delete button functionality
                listItem.querySelector(".deleteButton").addEventListener("click", function(){
                    const index = this.getAttribute("data-index");
                    deleteTask(index);
                });
            });
        });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `task=${encodeURIComponent(taskText)}`,
        })
            .then(() => {
                taskInput.value = '';
                fetchTasks(); // Refresh the task list
            });
    }
}

function deleteTask(index) {
    fetch('api.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `taskIndex=${index}`,
    })
    .then(() => fetchTasks());
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

fetchTasks(); // Load tasks when the page loads