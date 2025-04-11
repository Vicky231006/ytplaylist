'use client';

import { useState, useCallback, useRef } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, Alert, Snackbar } from '@mui/material';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { ThemeProvider } from '../components/ThemeProvider';
import { getPlaylistVideos } from '../utils/youtube';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const theme = useTheme();

  const extractPlaylistId = (url: string) => {
    const regex = /[&?]list=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = extractPlaylistId(playlistUrl);
    
    if (!id) {
      setError('Invalid playlist URL. Please enter a valid YouTube playlist URL.');
      return;
    }

    try {
      setLoading(true);
      setPlaylistId(id);
      const playlistVideos = await getPlaylistVideos(id);
      setVideos(playlistVideos);
      if (playlistVideos.length === 0) {
        setError('No videos found in this playlist.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist videos.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = useCallback(() => {
    if (videos.length === 1 && playerRef.current) {
      // For single video, restart the same video
      playerRef.current.playVideo();
    } else {
      // For multiple videos, move to next video
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  }, [videos.length]);

  const handleVideoReady = useCallback((event: YouTubeEvent) => {
    playerRef.current = event.target;
  }, []);

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const videoOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      loop: videos.length === 1 ? 1 : 0,
      playlist: videos.length === 1 ? videos[0]?.id : undefined,
    },
  };

  return (
    <ThemeProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            YouTube Playlist Streamer
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Playlist URL"
                variant="outlined"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=..."
                disabled={loading}
                error={Boolean(error)}
                helperText={error ? 'Please enter a valid playlist URL' : ''}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Playlist'}
              </Button>
            </Box>
          </form>
        </Paper>

        {videos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ flex: 2 }}>
              <Box sx={{ width: '100%', aspectRatio: '16/9', mb: 2 }}>
                <YouTube
                  videoId={videos[currentVideoIndex].id}
                  opts={videoOpts}
                  onEnd={handleVideoEnd}
                  onReady={handleVideoReady}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {videos[currentVideoIndex].title}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Playlist Videos
              </Typography>
              <List sx={{ maxHeight: '600px', overflow: 'auto' }}>
                {videos.map((video, index) => (
                  <ListItem key={video.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleVideoSelect(index)}
                      selected={index === currentVideoIndex}
                    >
                      <ListItemAvatar>
                        <Avatar src={video.thumbnail} alt={video.title} variant="square" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={video.title}
                        primaryTypographyProps={{
                          noWrap: true,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
} 