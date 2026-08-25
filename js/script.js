// To-Do List App with Local Storage

class ToDoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.closest('.filter-btn').dataset.filter));
        });

        // Action buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
        document.getElementById('deleteAllBtn').addEventListener('click', () => this.deleteAll());
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const category = document.getElementById('categorySelect').value;
        const text = input.value.trim();

        if (text === '') {
            alert('Please enter a task');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            category: category,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        input.value = '';
        input.focus();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    deleteAll() {
        if (confirm('Delete ALL tasks? This cannot be undone!')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        } else if (this.currentFilter === 'completed') {
            return this.tasks.filter(task => task.completed);
        } else {
            return this.tasks.filter(task => task.category === this.currentFilter);
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('remainingTasks').textContent = remaining;
    }

    getCategoryIcon(category) {
        const icons = {
            work: 'fas fa-briefcase',
            personal: 'fas fa-user',
            shopping: 'fas fa-shopping-bag',
            health: 'fas fa-heart',
            other: 'fas fa-circle'
        };
        return icons[category] || icons.other;
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="app.toggleTask(${task.id})"
                    >
                    <div class="task-content">
                        <div class="task-text">${this.escapeHtml(task.text)}</div>
                        <div class="task-meta">
                            <span class="task-category">
                                <i class="${this.getCategoryIcon(task.category)}"></i>
                                ${task.category}
                            </span>
                            <span class="task-date">📅 ${task.createdAt}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn task-btn-delete" onclick="app.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                tasksList.appendChild(li);
            });
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
    }
}

// Initialize app
const app = new ToDoApp();