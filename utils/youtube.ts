const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function getPlaylistVideos(playlistId: string) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured. Please add it to .env.local file.');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('YouTube API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch playlist videos');
    }

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid playlist data received');
    }

    return data.items.map((item: any) => ({
      id: item.snippet?.resourceId?.videoId,
      title: item.snippet?.title || 'Untitled Video',
      thumbnail: item.snippet?.thumbnails?.default?.url || '',
    })).filter((item: any) => item.id && item.title);
  } catch (error) {
    console.error('Error in getPlaylistVideos:', error);
    throw error;
  }
} 