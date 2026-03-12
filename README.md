# LawEzy – Legal Services Platform

A full-stack web app that connects clients with legal professionals. Users can sign up as **clients** or **legal professionals**, book appointments, use an AI legal assistant, browse blogs and resources, and chat with professionals.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19, Tailwind CSS, Radix UI (via shadcn/ui) |
| **Auth & Data** | Firebase (Auth, Firestore, Storage) |
| **AI** | Google Gemini API (AI Legal Assistant) |
| **Language** | TypeScript |

---

## Quick Start

### 1. Clone and install

```bash
cd lawezy-main
npm install
```

### 2. Environment variables (optional)

The app runs with built-in demo config. For your own Firebase and Gemini:

1. Copy `.env.example` to `.env.local`.
2. Fill in values from:
   - **Firebase:** [Firebase Console](https://console.firebase.google.com/) → your project → Project settings → General.
   - **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Accessing Both Roles, Database & Chatbot

### Two account types (Client vs Legal Professional)

- **Sign up:** Use the **Sign up** page and choose the **Client** or **Legal Professional** tab. Create **two accounts** (one of each) if you want to try both.
- **Login:** The same **Sign in** form works for both. After login you are redirected by role:
  - **Client** → `/dashboard`
  - **Legal Professional** → `/professional/dashboard`
  - **Admin** → `/admin`
- Your current role (Client / Professional / Admin) is shown in the top-right user menu.

### Database access

- **In-app (Admin only):** Log in as a user whose Firestore `role` is `"admin"`. You’ll be redirected to **Admin (Database)**. There you can see users, appointments, counts, and a button to open Firebase Console.
- **Make a user Admin:** In [Firebase Console](https://console.firebase.google.com/) → your project → **Firestore** → open the **users** collection → open a user document → add or edit the field `role` and set it to `"admin"`. Log in with that user to access `/admin`.
- **Direct Firestore access:** [Firebase Console](https://console.firebase.google.com/) → select project **lawezy-83e32** (or your project) → **Firestore Database** to view and edit all collections.

### Chatbot & messaging

- **AI Legal Assistant (chatbot):** Open **AI Chat** from the top menu, or go to [/ai-chat](http://localhost:3000/ai-chat). No login required. Uses the Gemini API for legal Q&A.
- **Chat (messaging):** Open **Chat** from the top menu, or go to [/chat](http://localhost:3000/chat). Requires login. Use the floating chat button (bottom-right) when logged in to message professionals.

---

## Project Structure (for reverse engineering)

```
lawezy-main/
├── app/                    # Next.js App Router (routes = folders)
│   ├── layout.tsx          # Root layout: ThemeProvider, AuthProvider, Toaster, FloatingChat
│   ├── page.tsx             # Landing page (public)
│   ├── login/
│   ├── signup/
│   ├── forgot-password/     # Password reset via Firebase email
│   ├── dashboard/           # Client dashboard (layout + page)
│   ├── professional/dashboard/  # Professional dashboard
│   ├── admin/               # Admin dashboard (database view; role = admin)
│   ├── profile/             # Edit profile (name, rates, bio, etc.)
│   ├── ai-chat/             # AI Legal Assistant (Gemini)
│   ├── appointments/        # List/book/manage appointments
│   │   ├── book/[id]/       # Book with a specific professional
│   │   └── availability/    # Professionals set availability
│   ├── chat/                # User–professional messaging
│   │   └── [id]/            # Conversation with one user
│   ├── blogs/               # Blog list, [id], create
│   └── resources/           # Legal resources, upload
├── components/
│   ├── main-nav.tsx         # Top nav + user menu (uses useAuth)
│   ├── floating-chat.tsx    # Bottom-right chat widget (Firestore messages)
│   ├── theme-provider.tsx   # Dark/light theme
│   └── ui/                  # shadcn components (Button, Card, Input, etc.)
├── lib/
│   ├── firebase.ts          # Firebase app, auth, db, storage init
│   ├── auth-provider.tsx    # React context: user, userData, signIn, signUp, logout, resetPassword
│   ├── schema.ts            # TypeScript types for Firestore (docs only)
│   ├── gemini.ts            # Gemini API + fallback responses
│   └── utils.ts             # cn() for Tailwind class merging
└── hooks/                   # useToast, use-mobile (UI)
```

---

## How It Works (reverse-engineering guide)

### 1. Authentication flow

- **Provider:** `lib/auth-provider.tsx` wraps the app and exposes `useAuth()`.
- **Firebase Auth** handles sign-in/sign-up; **Firestore** stores extra user data (role, name, designation, rates, etc.) in `users/{uid}`.
- **Roles:** `user` (client) vs `professional`. After login, redirect is:
  - Professional → `/professional/dashboard`
  - User → `/dashboard`
- **Password reset:** Login page links to `/forgot-password`; that page uses `sendPasswordResetEmail` from Firebase Auth.

**Syntax to notice:**

- `"use client"` at top of file = React Client Component (hooks, browser APIs).
- `createContext` + `useContext` = shared auth state.
- `onAuthStateChanged(auth, callback)` = subscribe to login/logout.

### 2. Routing (Next.js App Router)

- **File = route:** `app/dashboard/page.tsx` → `/dashboard`.
- **Dynamic:** `app/blogs/[id]/page.tsx` → `/blogs/123`.
- **Layouts:** `app/dashboard/layout.tsx` wraps all routes under `/dashboard` (e.g. shared nav).

**Syntax:**

- `export default function PageName()` = the page component.
- `useRouter()` from `next/navigation` for `router.push()`, `router.replace()`.
- `usePathname()` for current path (e.g. active nav link).

### 3. Firebase usage

- **Auth:** `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`.
- **Firestore:** `collection(db, "users")`, `doc(db, "users", uid)`, `getDoc`, `setDoc`, `addDoc`, `getDocs`, `query`, `where`, `orderBy`, `onSnapshot` (realtime).
- **Collections:** `users`, `blogs`, `appointments`, `messages`, `resources`, `availability`, etc. Types are described in `lib/schema.ts`.

**Syntax:**

- `getDoc(doc(db, "users", uid))` → one document.
- `getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(3)))` → list.
- `onSnapshot(query(...), callback)` → live updates (used in chat).

### 4. UI and styling

- **Tailwind:** Utility classes (`flex`, `gap-4`, `text-crimson-deep`, `bg-apricot`). Custom colors in `tailwind.config.ts` (e.g. `crimson-deep`, `apricot`).
- **shadcn/ui:** Components in `components/ui/` (Button, Card, Input, Dialog, etc.). Built on Radix UI; styled with Tailwind.
- **Theme:** `ThemeProvider` from `next-themes`; CSS variables in `app/globals.css` for light/dark.

**Syntax:**

- `className={cn("base classes", condition && "extra")}` — `cn()` merges and dedupes Tailwind classes.
- `<Button asChild><Link href="...">...</Link></Button>` — Radix `asChild` forwards props to the child.

### 5. AI Legal Assistant

- **Page:** `app/ai-chat/page.tsx` (client component).
- **API:** Calls Gemini `generateContent` with a legal system prompt; key can be set via `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`.
- **Fallback:** `lib/gemini.ts` has `getFallbackResponse()` for common topics if the API fails.

### 6. Key data flows

- **Sign up (professional):** Form → `signUp(email, password, "professional", { name, designation, rate, chatRate, appointmentRate, ... })` → Auth user created → `setDoc(doc(db, "users", uid), newUserData)` → redirect to `/professional/dashboard`.
- **Appointments:** Professionals listed from `users` where `role === "professional"`. Booking creates a document in `appointments`; professionals see pending/confirmed in `/appointments` (tabs).
- **Chat:** Messages in `messages` with `senderId`, `receiverId`, `participants: [uid1, uid2]`. Floating chat and `/chat/[id]` use `onSnapshot` for real-time messages.

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server (default port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Firestore collections (reference)

- **users** – Auth-linked profile (role, name, email, designation, rate, chatRate, appointmentRate, etc.).
- **blogs** – Title, content, excerpt, author, createdAt, tags, imageUrl.
- **appointments** – professionalId, userId, date, startTime, endTime, type, status (pending/confirmed/rejected/completed).
- **messages** – senderId, receiverId, content, timestamp, read, participants.
- **resources** – Title, description, category, fileUrl, uploadedBy, downloads.
- **availability** – professionalId, date, startTime, endTime (for booking slots).

---

## Learning checklist

1. Trace a full flow: e.g. Sign up → Dashboard → Appointments → Book → Appointments list.
2. Find where Firestore is read/written: search for `getDoc`, `setDoc`, `addDoc`, `getDocs`, `onSnapshot`.
3. See how auth guards work: e.g. `if (!user) router.push("/login")` in dashboard and appointments.
4. Compare client vs server: which files have `"use client"` and why (hooks, event handlers, browser APIs).
5. Inspect one shadcn component (e.g. `components/ui/button.tsx`) to see Radix + Tailwind pattern.

You can reverse-engineer the project by following routes in the app and matching them to the files and patterns above.
