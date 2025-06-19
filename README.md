# Tasbih Counter

A modern, responsive web application for tracking and counting tasbih (prayer beads) repetitions and other counting tasks.

## Features

- Create and manage multiple counting tasks
- Set target counts for each task
- Interactive counter with increment/decrement buttons
- Visual progress tracking
- Responsive design for mobile and desktop
- Data persistence using local storage
- Reorder tasks by moving them up or down one position at a time

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19 with Tailwind CSS
- **Components**: Shadcn UI (Radix UI)
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom gradients
- **TypeScript**: For type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tasbih-counter.git
   cd tasbih-counter
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Create a new counter**: Click the "New To Do" button and fill in the name and target count.
2. **Select a counter**: Click on any counter from the list to activate it.
3. **Count**: Use the + button to increment the count, or the - button to decrement.
4. **Track progress**: The progress bar and percentage display show your progress toward the target.
5. **Delete a counter**: Click the delete button next to any counter to remove it.
6. **Reorder counters**: Use the up arrow to move a counter one position up, or the down arrow to move it one position down.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── page.tsx          # Main application page
│   └── layout.tsx        # Root layout component
├── components/           # React components
│   ├── todo-counter.tsx  # Counter component
│   ├── todo-list.tsx     # List of counters
│   ├── todo-modal.tsx    # Modal for creating new counters
│   └── ui/               # Shadcn UI components
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 