# Task Dashboard

Your personal task management and monitoring system for OpenClaw.

## What It Does

Real-time dashboard showing:
- **Active Tasks** — What I'm working on right now with live progress
- **Upcoming Tasks** — Scheduled tasks coming up
- **Completed Tasks** — History of finished work with duration metrics

## Features

✅ **View & Monitor** — See real-time progress on all tasks  
✅ **Control Tasks** — Pause, complete, or cancel any task  
✅ **Create Tasks** — Add new tasks with priority, duration, and optional scheduling  
✅ **Drag & Drop** — Reorder priorities by dragging tasks  
✅ **Mobile-Friendly** — Works on phone, tablet, desktop  
✅ **Live Updates** — Auto-refreshes every 5 seconds  

## Access

**Local Network:**
```
http://localhost:3000
```

**From Phone (on same Wi-Fi):**
```
http://<your-mac-or-pc-ip>:3000
```

To find your IP:
- **Mac:** System Settings → Network → IP address
- **PC:** `ipconfig` in Command Prompt, look for IPv4 Address

## How to Use

### Viewing Tasks

1. **Active Tasks** — Currently working on these
2. **Upcoming Tasks** — Scheduled for later
3. **Completed Tasks** — Finished work with timing

Each task shows:
- Title and description
- Priority level (🔴 Critical → ⚪ Minimal)
- Progress bar
- Time started/scheduled/completed
- Duration

### Managing Tasks

**Start from Active:**
- Click **Details** to see full info
- Click **Pause** to pause it
- Click **Done** to mark complete
- Click **Cancel** to cancel

**Reorder Priority:**
- Drag tasks within their section to reorder

### Create New Task

1. Click **+ New Task**
2. Enter title and description
3. Set priority (1 = critical, 5 = minimal)
4. Set estimated duration
5. Optionally schedule for later
6. Click **Create Task**

## Metrics

Dashboard displays:
- **Active** — Number of tasks in progress
- **Upcoming** — Scheduled tasks
- **Completed Today** — How many I've finished today

## Technical Details

- **Framework:** Express.js + Vanilla JavaScript
- **Port:** 3000 (configurable via PORT env var)
- **Storage:** In-memory (resets on server restart)
- **Real-time:** Auto-refreshes via polling

## Coming Soon

- Database persistence (remember tasks between restarts)
- Time tracking integration
- Slack/Discord notifications
- Advanced filtering and search
- Export task history

---

Started: April 1, 2026
Built for: Jackson Harper
