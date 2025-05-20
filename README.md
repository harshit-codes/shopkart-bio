# ShopKart.bio

![License](https://img.shields.io/github/license/harshit-codes/shopkart-bio)

ShopKart.bio is an open-source e-commerce platform that allows users to create their brand and sell products or services online.

## Features (Planned)

- User authentication and profile management
- Brand creation and customization
- Product/service listing and management
- Shopping cart and checkout functionality
- Order management
- Payment integration
- Analytics dashboard

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Design System**: Shadcn UI
- **Backend**: Appwrite
- **Deployment**: Vercel (Frontend), Appwrite Cloud (Backend)
- **Version Control**: Git, GitHub

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Appwrite account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/harshit-codes/shopkart-bio.git
   cd shopkart-bio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Appwrite credentials

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
shopkart-bio/
├── app/             # Next.js app directory structure
├── components/      # Reusable UI components
├── lib/             # Utility functions and shared logic
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Appwrite](https://appwrite.io/)
- [Shadcn UI](https://ui.shadcn.com/)