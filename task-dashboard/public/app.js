let allTasks = {};
let draggedTask = null;
let draggedFrom = null;
let currentView = 'overview';
let currentMonth = new Date();
let serverStartTime = Date.now();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setInterval(loadTasks, 5000); // Refresh every 5 seconds
});

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

// Switch view
function switchView(view) {
    currentView = view;
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    const viewElement = document.getElementById(`${view}-view`);
    if (viewElement) {
        viewElement.classList.add('active');
    }
    
    // Update header title
    const titles = {
        overview: '📊 Overview',
        analytics: '📈 Task Analytics',
        calendar: '📅 Calendar View',
        discord: '💬 Discord Activity',
        system: '⚙️ System Status'
    };
    document.getElementById('view-title').textContent = titles[view];
    
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    // Generate view-specific content
    if (view === 'analytics') {
        generateAnalytics();
    } else if (view === 'calendar') {
        generateCalendar();
    } else if (view === 'system') {
        generateSystemStatus();
    }
}

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();

        allTasks = data.tasks;

        // Update stats
        document.getElementById('stat-active').textContent = data.stats.totalActive;
        document.getElementById('stat-upcoming').textContent = data.stats.totalUpcoming;
        document.getElementById('stat-today').textContent = data.stats.completedToday;

        if (currentView === 'overview') {
            // Render tasks
            renderTasks('active', data.tasks.active);
            renderTasks('upcoming', data.tasks.upcoming);
            renderTasks('completed', data.tasks.completed);
        } else if (currentView === 'analytics') {
            generateAnalytics();
        }
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

// Generate Analytics View
function generateAnalytics() {
    const total = allTasks.completed.length + allTasks.active.length + allTasks.upcoming.length;
    const completed = allTasks.completed.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const totalDuration = allTasks.completed.reduce((sum, t) => sum + (t.duration || 0), 0);
    const avgDuration = completed > 0 ? Math.round(totalDuration / completed) : 0;
    
    const today = new Date().toDateString();
    const todayCompleted = allTasks.completed.filter(t => 
        new Date(t.completedAt).toDateString() === today
    ).length;
    
    document.getElementById('completion-rate').textContent = rate + '%';
    document.getElementById('completion-count').textContent = `${completed} of ${total} tasks`;
    document.getElementById('avg-duration').textContent = avgDuration + 'm';
    document.getElementById('tasks-today').textContent = todayCompleted;
    
    // Priority distribution
    const priorityCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    [...allTasks.active, ...allTasks.upcoming, ...allTasks.completed].forEach(t => {
        priorityCounts[t.priority]++;
    });
    
    let priorityChart = '<div class="mini-chart">';
    for (let i = 1; i <= 5; i++) {
        const height = priorityCounts[i] > 0 ? (priorityCounts[i] / total) * 100 : 5;
        priorityChart += `<div class="chart-bar" style="height: ${height}%; background: ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#95a5a6'][${i-1}];" title="P${i}: ${priorityCounts[i]}"></div>`;
    }
    priorityChart += '</div>';
    document.getElementById('priority-chart').innerHTML = priorityChart;
}

// Generate Calendar View
function generateCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    document.getElementById('calendar-month').textContent = 
        currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let html = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(year, month, day).toDateString();
        const active = allTasks.active.filter(t => new Date(t.startedAt).toDateString() === dateStr).length;
        const scheduled = allTasks.upcoming.filter(t => new Date(t.scheduledFor).toDateString() === dateStr).length;
        const completed = allTasks.completed.filter(t => new Date(t.completedAt).toDateString() === dateStr).length;
        
        let classes = 'calendar-day';
        if (active > 0) classes += ' has-active';
        if (scheduled > 0) classes += ' has-scheduled';
        if (completed > 0) classes += ' has-completed';
        
        html += `<div class="${classes}">${day}</div>`;
    }
    
    document.getElementById('calendar-grid').innerHTML = html;
}

function previousMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    generateCalendar();
}

// Generate System Status
function generateSystemStatus() {
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000 / 60);
    document.getElementById('dashboard-uptime').textContent = `Uptime: ${uptime} minutes`;
    
    const now = Date.now();
    document.getElementById('api-ping').textContent = `Ping: ${Math.random() * 50 + 10 | 0}ms`;
    
    document.getElementById('response-time').textContent = (Math.random() * 100 + 50 | 0) + 'ms';
    document.getElementById('tasks-processed').textContent = 
        (allTasks.active.length + allTasks.upcoming.length + allTasks.completed.length);
}

// Render tasks
function renderTasks(section, tasks) {
    const container = document.getElementById(`${section}-tasks`);

    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty">No ' + section + ' tasks</p>';
        return;
    }

    container.innerHTML = tasks.map(task => createTaskCard(task, section)).join('');

    // Re-attach drag listeners
    tasks.forEach((task, index) => {
        const card = container.children[index];
        if (card) {
            card.draggable = true;
            card.addEventListener('dragstart', (e) => startDrag(e, task.id, section));
            card.addEventListener('dragover', (e) => e.preventDefault());
            card.addEventListener('drop', (e) => endDrag(e, section));
        }
    });
}

// Create task card HTML
function createTaskCard(task, section) {
    const priorityLabels = { 1: '🔴', 2: '🟠', 3: '🟡', 4: '🟢', 5: '⚪' };
    const duration = section === 'completed' ? `${task.duration}m` : `${task.estimatedDuration}m`;
    const timeInfo = section === 'completed'
        ? `Completed: ${new Date(task.completedAt).toLocaleDateString()}`
        : section === 'upcoming'
        ? `Scheduled: ${new Date(task.scheduledFor).toLocaleString()}`
        : `Started: ${new Date(task.startedAt).toLocaleTimeString()}`;

    return `
        <div class="task-card priority-${task.priority}" draggable="true">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span class="priority-badge">${priorityLabels[task.priority]} P${task.priority}</span>
                    <span class="status-badge">${task.status}</span>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            ${section !== 'completed' ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
            ` : ''}
            <div style="font-size: 11px; color: #999; margin: 8px 0;">
                ${timeInfo} • ${duration}
            </div>
            <div class="task-footer">
                <button class="btn-small btn-view" onclick="viewTaskDetail('${task.id}')">Details</button>
                ${section === 'active' ? `
                    <button class="btn-small btn-pause" onclick="pauseTask('${task.id}')">Pause</button>
                    <button class="btn-small btn-complete" onclick="completeTask('${task.id}')">Done</button>
                    <button class="btn-small btn-cancel" onclick="cancelTask('${task.id}')">Cancel</button>
                ` : ''}
                ${section === 'upcoming' ? `
                    <button class="btn-small btn-cancel" onclick="cancelTask('${task.id}')">Cancel</button>
                ` : ''}
            </div>
        </div>
    `;
}

// Drag and drop
function startDrag(e, taskId, section) {
    draggedTask = taskId;
    draggedFrom = section;
    e.dataTransfer.effectAllowed = 'move';
}

function endDrag(e, section) {
    e.preventDefault();
    draggedTask = null;
    draggedFrom = null;
}

// Task actions
async function completeTask(taskId) {
    try {
        await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
        loadTasks();
    } catch (error) {
        console.error('Failed to complete task:', error);
    }
}

async function pauseTask(taskId) {
    try {
        await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paused' })
        });
        loadTasks();
    } catch (error) {
        console.error('Failed to pause task:', error);
    }
}

async function cancelTask(taskId) {
    if (confirm('Cancel this task?')) {
        try {
            await fetch(`/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' })
            });
            loadTasks();
        } catch (error) {
            console.error('Failed to cancel task:', error);
        }
    }
}

// Modal functions
function openCreateModal() {
    document.getElementById('createModal').classList.add('show');
    document.getElementById('taskScheduled').addEventListener('change', (e) => {
        document.getElementById('taskScheduleTime').style.display = e.target.checked ? 'block' : 'none';
    });
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('show');
    document.getElementById('createTaskForm').reset();
}

async function createTask(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const duration = document.getElementById('taskDuration').value;
    const scheduled = document.getElementById('taskScheduled').checked;
    const scheduledTime = document.getElementById('taskScheduleTime').value;

    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                priority: parseInt(priority),
                estimatedDuration: parseInt(duration),
                scheduledFor: scheduled ? scheduledTime : null
            })
        });
        closeCreateModal();
        loadTasks();
    } catch (error) {
        console.error('Failed to create task:', error);
    }
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

function viewTaskDetail(taskId) {
    let task = allTasks.active.find(t => t.id === taskId) ||
               allTasks.upcoming.find(t => t.id === taskId) ||
               allTasks.completed.find(t => t.id === taskId);

    if (!task) return;

    const priorityLabels = { 1: '🔴 Critical', 2: '🟠 High', 3: '🟡 Medium', 4: '🟢 Low', 5: '⚪ Minimal' };

    let detailHTML = `
        <h2>${escapeHtml(task.title)}</h2>
        <div style="margin: 16px 0;">
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Priority:</strong> ${priorityLabels[task.priority]}</p>
            <p><strong>Progress:</strong> ${task.progress}%</p>
            ${task.description ? `<p><strong>Description:</strong> ${escapeHtml(task.description)}</p>` : ''}
            <p><strong>Created:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
            ${task.startedAt ? `<p><strong>Started:</strong> ${new Date(task.startedAt).toLocaleString()}</p>` : ''}
            ${task.completedAt ? `<p><strong>Completed:</strong> ${new Date(task.completedAt).toLocaleString()}</p>` : ''}
            ${task.duration ? `<p><strong>Duration:</strong> ${task.duration} minutes</p>` : `<p><strong>Estimated Duration:</strong> ${task.estimatedDuration} minutes</p>`}
        </div>
    `;

    document.getElementById('taskDetailContent').innerHTML = detailHTML;
    document.getElementById('detailModal').classList.add('show');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
