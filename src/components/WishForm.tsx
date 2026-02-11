import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Image, Video, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { fileToBase64 } from "@/lib/localStorage";

type MediaItem = {
  type: 'photo' | 'video' | 'voice';
  file: File;
  preview: string;
};

export type NewWish = {
  sender_name: string;
  message: string | null;
  media_type: string | null;
  media_urls: { type: string; url: string }[] | null;
};

const WishForm = ({ onWishAdded }: { onWishAdded: (wish: NewWish) => void }) => {
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit file size: 10MB for photos, 100MB for videos
      const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${type === 'photo' ? 'Photos' : 'Videos'} must be under ${type === 'photo' ? '10MB' : '100MB'}.`,
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      const newItem: MediaItem = {
        type,
        file,
        preview: URL.createObjectURL(file),
      };
      setMediaItems(prev => [...prev, newItem]);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' });
        const newItem: MediaItem = {
          type: 'voice',
          file,
          preview: URL.createObjectURL(audioBlob),
        };
        setMediaItems(prev => [...prev, newItem]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record voice notes.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearAllMedia = () => {
    mediaItems.forEach(item => URL.revokeObjectURL(item.preview));
    setMediaItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!senderName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim() && mediaItems.length === 0) {
      toast({
        title: "Content required",
        description: "Please add a message or upload media.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("Converting media for storage...");

    try {
      // Convert media files to base64 for localStorage storage
      const uploadedUrls: { type: string; url: string }[] = await Promise.all(
        mediaItems.map(async (item) => {
          const base64Url = await fileToBase64(item.file);
          return {
            type: item.type,
            url: base64Url, // Store as base64 data URL
          };
        })
      );

      // Determine media type based on what was "uploaded"
      let mediaType: string | null = 'text';

      if (uploadedUrls.length > 0) {
        if (uploadedUrls.length === 1) {
          mediaType = uploadedUrls[0].type;
        } else {
          mediaType = 'multiple';
        }
      }

      const newWish: NewWish = {
        sender_name: senderName.trim(),
        message: message.trim() || null,
        media_type: mediaType,
        media_urls: uploadedUrls.length ? uploadedUrls : null,
      };

      onWishAdded(newWish);

      toast({
        title: "Wish saved! 🎉",
        description: "Your wish has been saved to local storage.",
      });

      // Reset form
      setSenderName("");
      setMessage("");
      clearAllMedia();
    } catch (error) {
      console.error('Error preparing wish:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Failed to prepare wish",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasVoice = mediaItems.some(item => item.type === 'voice');

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-card p-8 rounded-3xl shadow-soft max-w-2xl mx-auto border border-border"
    >
      <h3 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
        Send Your Birthday Wish 🎂
      </h3>

      <div className="space-y-4">
        <Input
          placeholder="Your name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="text-lg bg-secondary border-border"
          maxLength={50}
        />

        <Textarea
          placeholder="Write your birthday message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] text-lg bg-secondary border-border"
          maxLength={500}
        />

        {/* Media upload buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'photo')}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button type="button" variant="outline" className="gap-2 border-border" asChild>
              <span>
                <Image className="w-4 h-4" />
                Photo
              </span>
            </Button>
          </label>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e, 'video')}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload">
            <Button type="button" variant="outline" className="gap-2 border-border" asChild>
              <span>
                <Video className="w-4 h-4" />
                Video
              </span>
            </Button>
          </label>

          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            className="gap-2 border-border"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={hasVoice && !isRecording}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
            {isRecording ? 'Stop Recording' : 'Voice Note'}
          </Button>
        </div>

        {/* Media count indicator */}
        {mediaItems.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{mediaItems.length} media file{mediaItems.length > 1 ? 's' : ''} attached</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={clearAllMedia}
              className="text-destructive hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Media previews */}
        {mediaItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {mediaItems.map((item, index) => (
              <div key={index} className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 z-10 bg-destructive text-destructive-foreground rounded-full w-6 h-6"
                  onClick={() => removeMediaItem(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                
                {item.type === 'photo' && (
                  <img
                    src={item.preview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-border"
                  />
                )}
                
                {item.type === 'video' && (
                  <video
                    src={item.preview}
                    controls
                    className="w-full h-32 object-cover rounded-xl border border-border"
                  />
                )}
                
                {item.type === 'voice' && (
                  <div className="bg-secondary p-3 rounded-xl flex items-center gap-2 border border-border h-32">
                    <Mic className="w-5 h-5 text-primary flex-shrink-0" />
                    <audio src={item.preview} controls className="flex-1 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[hsl(43,70%,35%)] hover:bg-[hsl(43,74%,42%)] text-white py-6 text-lg gap-2 border border-[hsl(43,74%,49%/0.3)] shadow-lg hover:shadow-[0_0_20px_hsl(43,74%,49%/0.3)] transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {uploadStatus || "Sending wish..."}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Birthday Wish
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default WishForm;
