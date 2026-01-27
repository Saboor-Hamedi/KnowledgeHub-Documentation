# KnowledgeHub - Project Overview

**KnowledgeHub** is a modern, high-performance workspace designed for developers to manage code snippets and project documentation seamlessly. It leverages the power of React, Vite, and Supabase to provide a fast, secure, and collaborative environment.

## 🛠 Tech Stack

*   **Core**: React 19, Vite 7
*   **Styling**: Tailwind CSS v4, Vanilla CSS (for custom themes)
*   **Routing**: React Router DOM v7
*   **State/Data**: Supabase (Auth & Database)
*   **UI/UX**: Framer Motion (Animations), Lucide React (Icons), React Markdown
*   **Utilities**: `cmdk` (Command Palette)

## 📂 Project Structure

*   `src/components`: Reusable UI components (Layouts, UI elements).
*   `src/pages`: Main application pages (`Docs`, `Updates`, `Login`, `Signup`).
*   `src/lib`: Configuration and helper libraries (e.b., Supabase client).
*   `src/index.css`: Global styles, Tailwind directives, and theme variables.

---

## 👨‍💻 How to Write Code

We adhere to strict coding principles to ensure maintainability, scalability, and a premium user experience.

### 1. DRY (Don't Repeat Yourself)
*   **Component Reuse**: Never duplicate UI logic. If a piece of UI is used more than once, extract it into a reusable component in `src/components`.
*   **Custom Hooks**: Encapsulate reusable logic (e.g., fetching data, handling form state) into custom hooks.
*   **Utility Functions**: Keep helper functions in a dedicated `utils` or `lib` file rather than hardcoding them inside components.

### 2. CLEAN Code
*   **Naming Conventions**: Use descriptive, predictable names for variables, functions, and components (e.g., `HeroBanner`, `fetchUserProjects`).
*   **Single Responsibility**: Each component should do one thing well. Break down large components into smaller sub-components.
*   **Readability**: Write code that is self-explanatory. Use comments only when complex logic requires clarification.
*   **File Organization**: Keep related files together. Co-locate styles or tests if necessary.

### 3. RESPONSIVE Design
*   **Mobile-First**: Build for mobile screens first, then scale up using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`).
*   **Fluid Layouts**: Use percentage-based widths, flexbox, and CSS grid to create layouts that adapt to any screen size.
*   **Touch Friendly**: Ensure interactive elements are large enough for touch targets on mobile devices.

### 4. MODERN Aesthetics
*   **Visual Polish**: This is a premium application. "Good enough" is not enough.
*   **Styling**:
    *   Use the **Glassmorphism** effect using the `.glass` utility or `backdrop-blur`.
    *   Utilize **Gradients** for text and backgrounds to add depth (e.g., `.gradient-text`).
    *   Stick to the defined color palette in `index.css` (primary blues, clean whites/grays).
*   **Animations**: usage of **Framer Motion** is encouraged for smooth page transitions, hover effects, and micro-interactions. The app should feel "alive".
*   **Typography**: Use the `prose` plugin for beautiful markdown rendering and clean sans-serif fonts for the UI.
*   **Tailwind v4**: Leverage the latest Tailwind features and the direct CSS variable configuration in `index.css`.
