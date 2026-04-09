const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

const initDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: [],
      agents: [
        { id: "a1", name: "CNfans", rating: 4.8, activeCampaigns: 5, budget: "$10k+" },
        { id: "a2", name: "KakoBuy", rating: 4.5, activeCampaigns: 3, budget: "$5k" },
        { id: "a3", name: "MuleBuy", rating: 4.7, activeCampaigns: 8, budget: "$20k+" }
      ],
      campaigns: [
        { id: "c1", authorId: "a1", authorName: "CNfans", authorRole: "AGENT", title: "Summer Haul Series", paymentType: "Fixed", reward: "$150", duration: "1 month", niche: "Streetwear", platforms: ["TikTok", "Instagram"] },
        { id: "c2", authorId: "a2", authorName: "KakoBuy", authorRole: "AGENT", title: "Back to School Promo", paymentType: "Commission", reward: "10% per sale", duration: "2 months", niche: "Accessories", platforms: ["YouTube", "TikTok"] }
      ],
      applications: [],
      messages: []
    }, null, 2));
  }
};

const getDb = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

initDb();

// --- Auth APIs ---
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const db = getDb();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: role || 'CREATOR',
    niche: 'Streetwear',
    bio: '',
    stats: { followers: '0', avgViews: '0' },
    createdAt: new Date()
  };

  db.users.push(newUser);
  saveDb(db);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, token: 'jwt-' + newUser.id });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _, ...u } = user;
  res.json({ user: u, token: 'jwt-' + user.id });
});

// --- User Profile APIs ---
app.patch('/api/users/:id', (req, res) => {
    const db = getDb();
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    db.users[index] = { ...db.users[index], ...req.body };
    saveDb(db);
    const { password: _, ...u } = db.users[index];
    res.json(u);
});

app.get('/api/creators', (req, res) => {
    const db = getDb();
    res.json(db.users.filter(u => u.role === 'CREATOR').map(({password, ...u}) => u));
});

// --- Campaign/Post APIs ---
app.get('/api/campaigns', (req, res) => res.json(getDb().campaigns));

app.post('/api/campaigns', (req, res) => {
    const { authorId, authorName, authorRole, title, paymentType, reward, description, duration } = req.body;
    const db = getDb();
    const newPost = {
        id: uuidv4(),
        authorId,
        authorName,
        authorRole,
        title,
        paymentType,
        reward,
        description,
        duration,
        platforms: ["TikTok"],
        niche: "Streetwear",
        createdAt: new Date()
    };
    db.campaigns.unshift(newPost);
    saveDb(db);
    res.status(201).json(newPost);
});

// --- Application APIs ---
app.post('/api/applications', (req, res) => {
    const { userId, userName, campaignId } = req.body;
    const db = getDb();
    
    const campaign = db.campaigns.find(c => c.id === campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    if (db.applications.find(a => a.userId === userId && a.campaignId === campaignId)) {
        return res.status(400).json({ error: 'Already applied' });
    }
    
    const newApp = { 
        id: uuidv4(), 
        userId, 
        userName,
        campaignId, 
        posterId: campaign.authorId,
        campaignTitle: campaign.title,
        agentName: campaign.authorName,
        status: 'Pending', 
        createdAt: new Date() 
    };
    db.applications.push(newApp);
    saveDb(db);
    res.status(201).json(newApp);
});

app.get('/api/applications/sent/:userId', (req, res) => {
    const db = getDb();
    res.json(db.applications.filter(a => a.userId === req.params.userId));
});

app.get('/api/applications/received/:userId', (req, res) => {
    const db = getDb();
    res.json(db.applications.filter(a => a.posterId === req.params.userId));
});

app.patch('/api/applications/:id', (req, res) => {
    const { status } = req.body;
    const db = getDb();
    const index = db.applications.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Application not found' });
    
    db.applications[index].status = status;
    saveDb(db);
    res.json(db.applications[index]);
});

app.listen(PORT, '0.0.0.0', () => console.log(`🔌 AgentConnect running at http://localhost:${PORT}`));
