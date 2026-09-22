# FocusOnTube

A distraction-stripped YouTube client for watching videos and taking timestamped notes, without the algorithmic feed.

## Overview

FocusOnTube is a React Native (Expo) app that searches YouTube directly via the YouTube Data API v3 and plays results in an embedded player (`react-native-youtube-iframe`) — with no home-feed recommendations, autoplay-into-the-next-video, or comments section. While watching, the user can jot free-text notes tied to that video, which persist locally and resurface the next time the same video is opened.

## Problem It Solves

YouTube's own app is built to maximize watch time via recommendations and autoplay, which works against focused, intentional viewing (e.g. watching a lecture or tutorial). FocusOnTube strips the client down to search → watch → take notes, so YouTube can be used as a video *reference* rather than an endless feed.

## Key Features

- **Direct YouTube search** — queries the YouTube Data API v3 `search` endpoint and paginates results with `nextPageToken`
- **Embedded player with fullscreen handling** — landscape lock on fullscreen, portrait lock otherwise, via `expo-screen-orientation`
- **Per-video notes** — timestamped free-text notes attached to a specific `videoId`, stored in a Redux slice and persisted to `AsyncStorage`, reloaded automatically when the same video is revisited
- **Notes-as-home-feed** — the Home screen lists the user's saved/annotated videos rather than a YouTube-driven recommendation feed
- **Auth** — Firebase Authentication with Google Sign-In (`expo-auth-session`), plus email/password sign-up
- **Light/dark theming** — app-wide theme managed through Redux (`themeSlice`) and a typed color hook (`useThemeColors`)

## What's Unique About It

- Uses the **YouTube Data API directly** rather than embedding YouTube's own app/website chrome — search, thumbnails, and metadata are fetched and rendered natively, so the surrounding UI (and what's absent from it — no suggested videos, no comments) is fully controlled by the app.
- **Notes are the primary navigation structure**: instead of a generic "watch history," the Home feed is literally the list of videos the user has taken notes on, reframing YouTube watching around active note-taking rather than passive consumption.

## Tech Stack

- **Framework**: React Native via Expo (~53)
- **Language**: TypeScript
- **State**: Redux Toolkit + React-Redux (`notesSlice`, `themeSlice`, `userSlice`)
- **Video**: `react-native-youtube-iframe`, YouTube Data API v3 (via `axios`)
- **Auth**: Firebase Auth + `expo-auth-session` (Google Sign-In)
- **Navigation**: React Navigation (native-stack + bottom-tabs)
- **UI**: `react-native-paper`, `@gorhom/bottom-sheet`, `@expo/vector-icons`

## Project Structure

```
FocusOnTube/
├── app/
│   ├── components/            # Shared UI components
│   ├── firebase/
│   │   └── config.ts           # Firebase initialization
│   ├── navigations/            # Bottom tabs + stack navigators
│   ├── redux/
│   │   ├── notesSlice.ts        # Per-video notes state
│   │   ├── themeSlice.ts        # Light/dark theme state
│   │   ├── userSlice.ts         # Auth/user state
│   │   └── store.ts
│   ├── screens/
│   │   └── app/
│   │       ├── auth/             # Login, SignUp, LoadingScreen
│   │       ├── Home.tsx          # List of annotated videos
│   │       ├── SearchScreen.tsx  # YouTube Data API search
│   │       ├── VideoScreen.tsx   # Player + notes UI
│   │       └── Settings.tsx
│   └── utills/
│       └── ThemeStyles.ts        # Typed hooks + theme colors
├── App.tsx
└── app.config.ts                 # Expo config (incl. YouTube API key, Google client IDs)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI
- A YouTube Data API v3 key
- A Firebase project with Authentication (Email/Password + Google) enabled

### Installation

```bash
npm install
```

### Configuration

API keys and OAuth client IDs are read from `app.config.ts` (`extra.youTubeApiKey`, `extra.androidClientId`, `extra.webClientId`) and `app/firebase/config.ts`. Replace these with your own YouTube Data API key and Firebase/Google OAuth credentials before running the app.

> The committed `app.config.ts` currently contains a live YouTube API key and Google OAuth client IDs — rotate/replace these before any public use of this repository.

### Run the App

```bash
npm start            # expo start
npm run android       # expo run:android
npm run ios           # expo run:ios
npm run web           # expo start --web
```
