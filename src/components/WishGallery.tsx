import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Image, Video, Mic, Cake, Trash2, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { base64ToBlobUrl } from "@/lib/localStorage";

export interface Wish {
  id: string;
  sender_name: string;
  message: string | null;
  media_type: string | null;
  // In the template we store media as an array of type/url pairs.
  // When you connect a real backend, you can adapt this shape as needed.
  media_urls: { type: string; url: string }[] | null;
  created_at: string;
}

const MESSAGE_CHAR_LIMIT = 150;

const WishGallery = ({
  wishes,
  onChangeWishes,
}: {
  wishes: Wish[];
  onChangeWishes: (wishes: Wish[]) => void;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessageExpand = (wishId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wishId)) {
        newSet.delete(wishId);
      } else {
        newSet.add(wishId);
      }
      return newSet;
    });
  };

  const handleDelete = async (wishId: string) => {
    onChangeWishes(wishes.filter(w => w.id !== wishId));
    toast({ title: "Wish deleted" });
  };

  const startEdit = (wish: Wish) => {
    setEditingId(wish.id);
    setEditName(wish.sender_name);
    setEditMessage(wish.message || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
  };

  const saveEdit = async (wishId: string) => {
    if (!editName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    onChangeWishes(
      wishes.map(w =>
        w.id === wishId
          ? { ...w, sender_name: editName.trim(), message: editMessage.trim() || null }
          : w
      )
    );
    cancelEdit();

    toast({ title: "Wish updated" });
  };

  const getMediaIcon = (type: string | null) => {
    switch (type) {
      case 'photo':
        return <Image className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'voice':
        return <Mic className="w-3 h-3" />;
      case 'multiple':
        return (
          <div className="flex gap-0.5">
            <Image className="w-2.5 h-2.5" />
            <Video className="w-2.5 h-2.5" />
            <Mic className="w-2.5 h-2.5" />
          </div>
        );
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  const parseMediaItems = (wish: Wish) => {
    if (!wish.media_urls || wish.media_urls.length === 0) return [];
    return wish.media_urls;
  };

  const isOwner = (_wish: Wish) => true;

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-3xl shadow-soft border border-border">
        <Cake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          No wishes yet!
        </h3>
        <p className="text-muted-foreground">
          Be the first to send a birthday wish! 🎉
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
              whileHover={{ scale: 1.02 }}
              className="bg-card p-2.5 rounded-lg shadow-soft border border-border break-inside-avoid mb-2 relative group"
            >
              {/* Edit/Delete buttons for owner */}
              {isOwner(wish) && editingId !== wish.id && (
                <div className="absolute top-1 right-1 flex gap-0.5 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 bg-secondary border border-border hover:bg-primary hover:text-primary-foreground"
                    onClick={() => startEdit(wish)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 bg-secondary border border-border hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(wish.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {editingId === wish.id ? (
                /* Edit mode */
                <div className="space-y-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="text-xs h-7 bg-secondary"
                  />
                  <Textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Your message"
                    className="text-xs min-h-[60px] bg-secondary"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="flex-1 h-6 text-xs bg-primary"
                      onClick={() => saveEdit(wish.id)}
                    >
                      <Check className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-6 text-xs"
                      onClick={cancelEdit}
                    >
                      <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {wish.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-xs truncate">{wish.sender_name}</p>
                      <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        {getMediaIcon(wish.media_type)}
                        <span>
                          {new Date(wish.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {wish.message && (
                    <div className="mb-2">
                      <p className={`text-foreground text-xs leading-relaxed ${
                        !expandedMessages.has(wish.id) && wish.message.length > MESSAGE_CHAR_LIMIT 
                          ? 'line-clamp-4' 
                          : ''
                      }`}>
                        {wish.message}
                      </p>
                      {wish.message.length > MESSAGE_CHAR_LIMIT && (
                        <button
                          onClick={() => toggleMessageExpand(wish.id)}
                          className="text-primary text-xs font-medium mt-1 hover:underline"
                        >
                          {expandedMessages.has(wish.id) ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Media */}
                  {wish.media_urls && wish.media_urls.length > 0 && (
                    <div className="space-y-2">
                      {parseMediaItems(wish).map((media, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden">
                          {media.type === 'photo' && (
                            <img
                              src={media.url}
                              alt={`Photo from ${wish.sender_name}`}
                              className="w-full object-cover rounded-lg min-h-[160px] max-h-[260px]"
                              loading="lazy"
                            />
                          )}
                          
                          {media.type === 'video' && (
                            <div className="relative w-full">
                              <video
                                src={media.url}
                                controls
                                controlsList="nodownload"
                                className="w-full rounded-lg aspect-video object-cover"
                                preload="metadata"
                                playsInline
                                style={{ touchAction: 'manipulation', minHeight: '200px' }}
                              />
                            </div>
                          )}
                          
                          {media.type === 'voice' && (
                            <div className="bg-secondary p-3 sm:p-4 rounded-lg border border-border">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground">Voice Note</span>
                              </div>
                              <audio 
                                src={media.url} 
                                controls 
                                className="w-full h-12" 
                                preload="metadata"
                                style={{ minWidth: '100%' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default WishGallery;