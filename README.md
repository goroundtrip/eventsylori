# YLori Events

A modern platform for discovering and creating amazing events, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎉 Event Discovery and Creation
- 🔐 Multiple Authentication Methods (Email, Social, Web3)
- 💳 Payment Integration (Stripe, Crypto)
- 🎟️ NFT-based Ticketing
- 📱 Responsive Design
- 🌙 Dark Mode Support

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe, Web3
- **Styling**: Tailwind CSS, Headless UI

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ylori-events.git
   cd ylori-events
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
ylori-events/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── components/      # Reusable components
│   ├── lib/             # Utility functions
│   └── pages/           # Page components
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from [Cryptonomads](https://cryptonomads.org) and [Superteam](https://superteam.fun)
- Built with ❤️ by the YLori team 