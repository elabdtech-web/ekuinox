import React, { useState, useRef, useEffect } from 'react';
import { IoPlay, IoPause, IoVolumeHigh, IoVolumeMute, IoExpand, IoContract } from 'react-icons/io5';

const CustomVideoPlayer = ({ videoUrl, videoTitle, className = "" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // YouTube video detection
  const isYouTube = videoUrl && (videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com'));
  const youtubeVideoId = isYouTube ? videoUrl.split('/').pop().split('?')[0] : null;

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Video event handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (!videoUrl) {
    return (
      <div className={`relative rounded-lg bg-black/20 flex items-center justify-center ${className}`}>
        <div className="text-white/60 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <IoPlay className="w-8 h-8 ml-1" />
          </div>
          <p>No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-black group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {isYouTube ? (
        // YouTube iframe with custom overlay
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
            title={videoTitle || 'Product Video'}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Custom overlay for YouTube (minimal since YouTube has its own controls) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-lg font-medium truncate">
              {videoTitle || 'Product Video'}
            </h3>
          </div>
        </div>
      ) : (
        // Custom video player for direct videos
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play button overlay (when paused) */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-black/50 border-2 border-white/30 flex items-center justify-center hover:bg-black/70 hover:border-white/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <IoPlay className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          )}

          {/* Custom Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <div
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-[#5695F5] rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#5695F5] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-[#5695F5] transition-colors"
                >
                  {isPlaying ? <IoPause className="w-6 h-6" /> : <IoPlay className="w-6 h-6" />}
                </button>

                {/* Time */}
                <div className="text-white/80 text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-[#5695F5] transition-colors"
                  >
                    {isMuted || volume === 0 ? <IoVolumeMute className="w-5 h-5" /> : <IoVolumeHigh className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#5695F5] transition-colors"
              >
                {isFullscreen ? <IoContract className="w-5 h-5" /> : <IoExpand className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomVideoPlayer;

// Custom styles for the video player
const styles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #5695F5;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(86, 149, 245, 0.3);
  }

  .slider::-webkit-slider-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #5695F5;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(86, 149, 245, 0.3);
  }

  .slider::-moz-range-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}