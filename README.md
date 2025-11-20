
# 🌿 Kindred Mind – Mental Health Support Platform  
*A compassionate, modern, and privacy‑focused emotional support assistant.*

Kindred Mind is an interactive mental‑health support web application designed to provide a safe and empathetic experience for users seeking guidance, emotional check‑ins, journaling, or supportive conversation.  
The goal of the project is to create a lightweight, fast, and secure wellness companion using the latest web technologies.

---

# ✨ Overview

Kindred Mind combines:

- **AI‑assisted reflective conversation**
- **Smooth, minimalistic UI**
- **Secure user authentication**
- **A privacy‑aware architecture**

This project prioritizes comfort, emotional safety, and user privacy. It is intended for general wellness support — *not for clinical diagnosis or emergency intervention.*

---

# 🚀 How Kindred Mind Works

## 1. 🧠 AI‑Assisted Conversations
Users interact with a supportive conversational interface designed to:

- Encourage emotional openness  
- Provide reflective feedback  
- Offer grounding, mindfulness, and breathing prompts  
- Promote self‑awareness through structured conversation  

The AI assistant is intentionally designed to avoid giving medical, legal, or harmful advice.

---

## 2. 👤 User Authentication (Supabase)
Kindred Mind uses **Supabase Authentication** for:

- Email/password login  
- Session persistence  
- Secure user identification  

Supabase policies ensure that each user's data (if stored) is accessible only to them.

---

## 3. 🗂️ Optional Journaling & History
The platform can be extended to store:

- User reflections  
- Daily emotional check‑ins  
- Chat logs (encrypted or private‑only mode)  

This portion is modular — the current design allows turning data storage **on or off**, supporting both:

- **Anonymous mode**
- **Personalized mode with journaling**

---

## 4. 🎨 Frontend Architecture

The frontend is built with:

- **React + TypeScript** for predictable, type‑safe UI logic  
- **Vite** for ultra‑fast development and builds  
- **Tailwind CSS** for responsive, clean styling  
- **shadcn/ui** for high‑quality, accessible components  

This enables:

- Smooth user experience
- Fast loading times
- Mobile‑first design
- Reusable components

---

## 5. 🔌 Supabase Backend

Supabase provides:

### ✔ Authentication  
Used for login, signup, and session handling.

### ✔ Database  
(If journaling/chat history is enabled)

Tables may include:

```
users
journal_entries
chat_sessions
mood_logs
```

### ✔ Row-Level Security  
Every row is tied to a user ID so nobody can access another user's data.

---

# 🛠️ System Architecture

```
┌───────────────────────────┐
│        Client App         │
│ React + TS + Tailwind     │
│  (UI, Chat, Journal UI)   │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│    Supabase Auth API      │
│ Login, Sign‑up, Sessions  │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Supabase Database         │
│ Journals, Mood logs etc   │
│ Row Level Security (RLS)  │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│       AI Assistant        │
│ (Frontend‑hosted logic)   │
└───────────────────────────┘
```

---

# 📂 Project Structure

```
kindred-mind/
├── src/
│   ├── components/       # UI components (chat box, inputs, headers)
│   ├── pages/            # Pages (Home, Chat, Login, Register)
│   ├── lib/              # Supabase client, helpers
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles
│   ├── App.tsx           # App root
│   └── main.tsx          # Entry point
│
├── supabase/             # Supabase config and migrations
├── public/               # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

# ⚙️ Installation & Setup

## 1. Clone the repository
```bash
git clone https://github.com/faziljunaida/kindred-mind
cd kindred-mind
```

## 2. Install dependencies
```bash
npm install
```

## 3. Create an `.env` file
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Start development server
```bash
npm run dev
```

## 5. Build for production
```bash
npm run build
```

---

# 🔐 Privacy & Safety Principles

Kindred Mind follows these design rules:

### ✔ No unnecessary data collection  
Users can use the app without storing any personal information.

### ✔ Explicit safety disclaimers  
The app is **not** a replacement for professional mental‑health care.

### ✔ Non‑diagnostic and non‑medical  
All responses avoid medical, harmful, or unsafe advice.

### ✔ Optional anonymity  
Users may interact without creating journals or saving logs.

---

# 📦 Deployment

### Deploy to Vercel
- Import repo  
- Add environment variables  
- Deploy

### Deploy to Netlify
- Build: `npm run build`  
- Publish folder: `dist/`

---

# 🧭 Roadmap

- [ ] Mood analytics dashboard  
- [ ] Encrypted journals  
- [ ] Guided meditation & breathing tools  
- [ ] Offline‑first mode  
- [ ] AI personality customization  

---

# 📝 License
MIT License (can be changed as needed)

---

# 🤝 Contributing
Pull requests are welcome!

---

# 📬 Contact
*Add your email or socials here.*

