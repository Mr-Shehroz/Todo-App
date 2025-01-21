import inquirer from 'inquirer';
import { writeFileSync, existsSync, readFileSync } from 'node:fs';

const filepath = "todo.json";
let tasks = existsSync(filepath) ? JSON.parse(readFileSync(filepath)) : [];

function saveTask() {
    writeFileSync(filepath, JSON.stringify(tasks));
}

async function addTask() {
    const { name } = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Please enter your task:',
    }]);

    if (!name.trim()) {
        console.log("Task cannot be empty.");
        return;
    }

    const task = {
        id: Date.now(),
        title: name.trim(),
        completed: false,
    };

    tasks.push(task);
    saveTask();
    console.log("Task added successfully.");
}

function viewTasks() {
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    tasks.forEach((task, index) => {
        console.log(`${index + 1} [${task.completed ? 'Done' : ' '}] ${task.title} (ID: ${task.id})`);
    });
}

async function deleteTask() {
    const { id: taskid } = await inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: 'Please enter the ID of the task you want to delete:',
    }]);

    const index = tasks.findIndex((task) => task.id === parseInt(taskid));
    if (index === -1) {
        console.log("Task not found.");
        return;
    }

    tasks.splice(index, 1);
    saveTask();
    console.log("Task deleted successfully.");
}

async function completeTask() {
    const { id: taskid } = await inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: 'Please enter the ID of the task you want to complete:',
    }]);

    const task = tasks.find((task) => task.id === parseInt(taskid));
    if (!task) {
        console.log("Task not found.");
        return;
    }

    task.completed = true;
    saveTask();
    console.log("Task marked as completed.");
}

async function main() {
    while (true) {
        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Add Task', value: 'add' },
                { name: 'View Tasks', value: 'view' },
                { name: 'Mark Task as Completed', value: 'complete' },
                { name: 'Delete Task', value: 'delete' },
                { name: 'Exit', value: 'exit' },
            ],
        }]);

        if (action === 'add') {
            await addTask();
        } else if (action === 'view') {
            viewTasks();
        } else if (action === 'complete') {
            await completeTask();
        } else if (action === 'delete') {
            await deleteTask();
        } else if (action === 'exit') {
            break;
        }
    }
}

main();
