# 🚀 JobTrac - Your Ultimate Job Switch Command Center

**JobTrac** is a sleek, all-in-one dashboard designed to streamline and organize every facet of your job search. From tracking applications to preparing for interviews, JobTrac is the command center you need to conquer your next career move.

![JobTrac Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png)
*(Feel free to replace the link above with a screenshot of the application!)*

---

## ✨ Key Features

-   **📝 Application Tracker:** Monitor your job applications from "To Apply" to "Offer." Never lose track of an opportunity again.
-   **📚 Prep Log:** Document your interview preparation sessions. Track topics, time spent, and rate your confidence to identify areas for improvement.
-   **🏢 Company Research:** Store in-depth research on target companies, including their values, your motivations, and key questions to ask during interviews.
-   **🤝 Networking & Referrals:** Manage your professional contacts, track outreach, and note who has provided referrals.
-   **⭐ STAR Story Bank:** Build a powerful arsenal of behavioral interview answers using the STAR (Situation, Task, Action, Result) method.
-   **🔐 Secure Authentication:** Safe and secure sign-in with your Google account, powered by Firebase.
-   **🌙 Dark & Light Mode:** A beautiful, modern interface with a theme toggle for your viewing pleasure.
-   **✏️ Full CRUD Functionality:** Easily add, view, edit, and delete any entry across all modules.

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
-   **Icons:** [Lucide React](https://lucide.dev/guide/react)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/jobtrac.git
    cd jobtrac
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the root of the project by copying the example file:
        ```sh
        cp .env.example .env
        ```
    -   Open the `.env` file and replace the placeholder values with your actual Firebase project credentials. You can find these in your [Firebase project console](https://console.firebase.google.com/).

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

---

## 📜 Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run lint`: Lints the codebase using ESLint to find and fix problems.
-   `npm run preview`: Serves the production build locally to preview it.

---

## 📂 Project Structure

The project is organized with a clear separation of concerns to make it easy to navigate and maintain.

```
/
├── public/
├── src/
│   ├── assets/
│   ├── components/   # Reusable React components
│   ├── config/       # Firebase configuration
│   ├── data/         # Initial/mock data
│   ├── hooks/        # Custom React hooks (useAuth, useFirestore, etc.)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── .env.example      # Environment variable template
├── .gitignore
├── index.html
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
