# Formalyze

This is a full-stack web application that uses artificial intelligence to generate survey questions and analyze user responses. 

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Git Commit Conventions](#git-commit-conventions)
- [Branching](#branching)
- [Pull Requests](#pull-requests)

## Technology Stack

* Frontend: React
* Backend: Express/Node

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/shannon-jx/formalyze.git
   cd formalyze
   
2. Install dependencies for both client and server:

* Client (React):
  ```bash
  cd client
  npm install

* Server (Node.js):
  ```bash
  cd ../server
  npm install

## Running the Application

1. Start the Backend Server

  ```
  cd server
  npm run dev
  ```

2. Start the Frontend Client

  ```
  cd ../client
  npm start
  ```

3. Open http://localhost:3000 to view the frontend in the browser.

## Git Commit Conventions 
- feat: Used when adding a new feature to the project 
- fix: Used when fixing a bug 
- docs: Used when updating documentation 
- refactor: Used when refactoring code without changing its behavior 
- test: Used when adding or modifying tests 
- chore: Used for miscellaneous tasks 
 
## Branching 

`<name> / <type_of_change> / <description>`

eg. `tom/feat/home-page`
 
## Pull Requests 

- [ ] Describe your Changes 
- [ ] Issue(s) Fixed
- [ ] Things to Note 
- [ ] Type of Change

## Firebase Configuration

To set up Firebase for this project:

1. Create a Firebase project at https://console.firebase.google.com/
2. In the Firebase console, go to Project settings and find your web app configuration
3. Copy the configuration values and paste them into the `.env` file in the `client` directory
4. Make sure not to commit the `.env` file to version control

The `.env` file should look like this:

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with your actual Firebase configuration.