import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Upload, Video, FileVideo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VideoCompressor = () => {
  const [loaded, setLoaded] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading FFmpeg...');
  
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    try {
      console.log('Loading FFmpeg...');
      setLoadingMessage('Downloading FFmpeg...');
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg Log:', message);
        if (messageRef.current) {
          messageRef.current.innerHTML = message;
        }
      });

      ffmpeg.on('progress', ({ progress, time }) => {
        const percentage = Math.round(progress * 100);
        console.log('Compression progress:', percentage);
        setProgress(percentage);
        setLoadingMessage(`Processing: ${percentage}% (${(time / 1000000).toFixed(1)}s)`);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setLoaded(true);
      setLoadingMessage('');
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load FFmpeg. Please refresh and try again."
      });
    }
  };

  useEffect(() => {
    load();
    return () => {
      const ffmpeg = ffmpegRef.current;
      if (ffmpeg) {
        ffmpeg.terminate();
      }
    };
  }, []);

  const compressVideo = async (file: File) => {
    const ffmpeg = ffmpegRef.current;
    if (!loaded) {
      toast({
        variant: "destructive",
        title: "Not Ready",
        description: "Please wait for FFmpeg to load"
      });
      return;
    }

    try {
      setCompressing(true);
      setProgress(0);
      setLoadingMessage('Preparing video...');

      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      setLoadingMessage('Compressing video...');
      
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-c:v', 'libx264',         // Video codec
        '-crf', '32',              // Higher CRF = more compression
        '-preset', 'veryfast',     // Much faster encoding
        '-tune', 'fastdecode',     // Optimize for fast decoding
        '-movflags', '+faststart', // Enable fast start for web playback
        '-c:a', 'aac',            // Audio codec
        '-b:a', '96k',            // Reduced audio bitrate
        '-ac', '1',               // Convert to mono audio
        '-vf', 'scale=iw*0.8:-2', // Reduce resolution by 20%
        '-r', '24',               // Limit framerate to 24fps
        '-y',                     // Overwrite output files
        'output.mp4'
      ]);

      setLoadingMessage('Finalizing...');
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      setCompressedSize(blob.size);
      
      const compressedFile = new File([blob], file.name, { type: 'video/mp4' });
      
      // Store the compressed file in localStorage temporarily
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        if (e.target?.result) {
          localStorage.setItem('compressedVideo', JSON.stringify({
            name: file.name,
            size: compressedFile.size,
            data: e.target.result
          }));
          
          toast({
            title: "Success",
            description: "Video compressed successfully!"
          });
          
          // Navigate back to the videos page
          navigate('/app/upload');
        }
      };
      fileReader.readAsDataURL(compressedFile);
      
      setLoadingMessage('Compression complete!');
      setProgress(100);
    } catch (error) {
      console.error('Error during compression:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to compress video. Please try again."
      });
    } finally {
      setCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setOriginalSize(file.size);
      setCompressedSize(0);
      setProgress(0);
      setLoadingMessage('');
      compressVideo(file);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="bg-dashboard-card rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <FileVideo className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Video Compressor</h1>
          <p className="text-muted-foreground mt-2">
            {loadingMessage || (loaded ? 'Upload your video to compress it' : 'Loading FFmpeg...')}
          </p>
        </div>

        <div className="space-y-6">
          <label className="block">
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-input"
                disabled={!loaded || compressing}
              />
              <label
                htmlFor="video-input"
                className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg transition-colors ${
                  loaded && !compressing
                    ? 'border-border/40 cursor-pointer hover:border-primary'
                    : 'border-border/20 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${loaded && !compressing ? 'text-muted-foreground' : 'text-muted-foreground/50'}`} />
                  <span className={loaded && !compressing ? 'text-foreground' : 'text-muted-foreground'}>
                    {loaded ? (compressing ? 'Compressing...' : 'Click to upload video') : 'Loading FFmpeg...'}
                  </span>
                </div>
              </label>
            </div>
          </label>

          {video && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Original size: {formatSize(originalSize)}</span>
                {compressedSize > 0 && (
                  <span>Compressed size: {formatSize(compressedSize)}</span>
                )}
              </div>

              {(compressing || progress > 0) && (
                <div className="space-y-2">
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {progress}% complete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p ref={messageRef} className="mt-4 text-sm text-muted-foreground text-center"></p>
      </div>
    </div>
  );
};

export default VideoCompressor;