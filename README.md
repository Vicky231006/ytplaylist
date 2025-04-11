# YouTube Playlist Streamer

A web application that allows users to stream YouTube playlists with continuous playback and no ads. Built with Next.js, Material-UI, and the YouTube Data API.

## Features

- Stream YouTube playlists without interruptions
- Automatic video looping for single videos
- Light/Dark mode support
- Mobile-friendly design
- Background playback support
- No ads
- Responsive UI with video thumbnails

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Vicky231006/ytplaylist.git
cd ytplaylist
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your YouTube Data API key:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_YOUTUBE_API_KEY`: Your YouTube Data API key (required)

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

Make sure to add your YouTube API key to the environment variables in your Vercel project settings.

## Built With

- [Next.js](https://nextjs.org/)
- [Material-UI](https://mui.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [TypeScript](https://www.typescriptlang.org/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
