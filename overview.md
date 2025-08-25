#  Project Overview

  The project, JobTrac, is a web application designed to be a "Job Search Command Center". It helps users manage every aspect of their job search, from finding and applying for jobs to
  preparing for interviews and managing networking contacts.

  Core Features

   * Application Tracker: A comprehensive tool to track job applications through various stages (e.g., "To Apply", "Applied", "Offer", "Rejected").
   * Prep Log: A feature to log and track interview preparation sessions, including topics, time spent, and confidence levels.
   * Company Research: A place to store research about target companies, including their values, what they do, and questions to ask during interviews.
   * Networking & Referrals: A tool to manage networking contacts and track outreach efforts.
   * Behavioral Story Bank (STAR): A dedicated module to create and store STAR (Situation, Task, Action, Result) stories for behavioral interviews.
   * Smart Notes: An advanced note-taking system with Markdown support, multiple pages, and real-time synchronization.
   * Profile & Insights:
       * Analytics Dashboard: Visualizes job search activity with charts.
       * Goal Setting: Allows users to set and track weekly or monthly goals.
       * Celebrate Wins: Provides a confetti animation when goals are reached.

  Technical Stack

   * Frontend: React, TypeScript, Vite
   * Styling: Tailwind CSS
   * State Management: React Hooks (useState, useCallback, etc.)
   * Routing: React Router
   * Animations: Framer Motion
   * Charts: Recharts
   * Backend: Firebase (Authentication, Firestore, Analytics)
   * Linting: ESLint

  Architecture

   * Component-Based: The application is built with a clear component-based architecture, with components organized by feature.
   * Feature-Driven Structure: The src/features directory contains the core functionalities of the application, with each feature having its own components, hooks, and exports.
   * Custom Hooks: The application makes extensive use of custom hooks to encapsulate and reuse logic, such as useFirestore for data fetching, useAuth for authentication, and useTheme for theme
     management.
   * Real-time Data: The application uses Firestore's real-time capabilities to keep the data synchronized across devices.
   * Responsive Design: The application has a responsive design that adapts to different screen sizes, with a separate mobile dashboard.
   * Secure: The application uses environment variables to store Firebase API keys, which is a secure practice.

  Data Models

  The src/types/index.ts file defines the data structures used in the application, including:

   * Application
   * PrepEntry
   * CompanyResearch
   * NetworkingContact
   * StarStory
   * NotePage
   * UserNotes
   * Goal

  Setup and Configuration

   * The project uses Vite for building and development.
   * The package.json file defines the project's dependencies and scripts.
   * The .env.example file shows the required environment variables for connecting to Firebase.