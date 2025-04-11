const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function getPlaylistVideos(playlistId: string) {
  try {
    const response = await fetch(`/api/playlist?playlistId=${playlistId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch playlist videos');
    }

    return data.videos;
  } catch (error) {
    console.error('Error in getPlaylistVideos:', error);
    throw error;
  }
} 