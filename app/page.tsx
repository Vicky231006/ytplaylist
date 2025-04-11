'use client';

import { useState, useCallback, useRef } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, Alert, Snackbar, useMediaQuery, useTheme } from '@mui/material';
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      playsinline: 1, // Enable inline playback on iOS
    },
  };

  return (
    <ThemeProvider>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: { xs: 2, sm: 4 },
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            YouTube Playlist Streamer
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 3 },
              }}
            >
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
                size={isMobile ? "small" : "medium"}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size={isMobile ? "medium" : "large"}
                disabled={loading}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: '150px' },
                }}
              >
                {loading ? 'Loading...' : 'Load Playlist'}
              </Button>
            </Box>
          </form>
        </Paper>

        {videos.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 4 },
            }}
          >
            <Box 
              sx={{ 
                flex: { md: 2 },
                width: '100%',
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 1,
                }}
              >
                <YouTube
                  videoId={videos[currentVideoIndex].id}
                  opts={videoOpts}
                  onEnd={handleVideoEnd}
                  onReady={handleVideoReady}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {videos[currentVideoIndex].title}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                flex: { md: 1 },
                width: '100%',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Playlist Videos
              </Typography>
              <List 
                sx={{ 
                  maxHeight: { xs: '300px', md: '600px' },
                  overflow: 'auto',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                }}
              >
                {videos.map((video, index) => (
                  <ListItem key={video.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleVideoSelect(index)}
                      selected={index === currentVideoIndex}
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={video.thumbnail} 
                          alt={video.title} 
                          variant="square"
                          sx={{
                            width: { xs: 60, sm: 80 },
                            height: { xs: 45, sm: 60 },
                            borderRadius: 1,
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={video.title}
                        primaryTypographyProps={{
                          noWrap: true,
                          sx: {
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            ml: 1,
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <Snackbar 
          open={Boolean(error)} 
          autoHideDuration={6000} 
          onClose={handleCloseError}
          sx={{
            bottom: { xs: 70, sm: 24 },
          }}
        >
          <Alert 
            onClose={handleCloseError} 
            severity="error" 
            sx={{ 
              width: '100%',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
} 