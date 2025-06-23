'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, 
  MessageCircle, 
  Send, 
  Loader2,
  User,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { getUserId, hasRated } from '@/lib/user-id';

interface Rating {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface RatingStats {
  average_rating: number;
  total_ratings: number;
  ratings_distribution: Record<number, number>;
}

interface RatingSystemProps {
  promptId: string;
  ratings: Rating[];
  stats: RatingStats;
  onRatingSubmit: (rating: number, comment?: string) => Promise<void>;
  className?: string;
}

export function RatingSystem({
  promptId,
  ratings,
  stats,
  onRatingSubmit,
  className
}: RatingSystemProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const userId = getUserId();
  const userHasRated = hasRated(promptId, ratings);
  const userRating = ratings.find(r => r.user_id === userId);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (userHasRated) {
      toast.info('You have already rated this prompt');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRatingSubmit(selectedRating, comment.trim() || undefined);
      setSelectedRating(0);
      setComment('');
      toast.success('Thank you for your rating!');
    } catch (error) {
      console.error('Rating submission error:', error);
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = interactive 
        ? (hoveredRating || selectedRating) >= starValue
        : rating >= starValue;

      return (
        <Star
          key={i}
          className={cn(
            "w-5 h-5 cursor-pointer transition-colors",
            isFilled 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground hover:text-yellow-400",
            interactive && "hover:scale-110 transition-transform"
          )}
          onClick={interactive ? () => setSelectedRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  const renderRatingDistribution = () => {
    const total = stats.total_ratings;
    if (total === 0) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.ratings_distribution[star] || 0;
          const percentage = (count / total) * 100;

          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-muted-foreground">{star}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Rating Overview */}
      <div className="text-center space-y-4">
        {stats.total_ratings > 0 ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1">
                {renderStars(Math.round(stats.average_rating))}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {stats.average_rating.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.total_ratings} rating{stats.total_ratings !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {renderRatingDistribution()}
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1">
              {renderStars(0)}
            </div>
            <p className="text-muted-foreground">No ratings yet</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Rating Form */}
      {!userHasRated ? (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Star className="w-4 h-4" />
            Rate this prompt
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1">
              {renderStars(selectedRating, true)}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Comment (optional)
              </label>
              <Textarea
                placeholder="Share your thoughts about this prompt..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={280}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/280
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Submit Rating
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">You rated this prompt</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(userRating?.rating || 0)}
          </div>
          {userRating?.comment && (
            <p className="text-sm text-green-600 italic">
              "{userRating.comment}"
            </p>
          )}
        </div>
      )}

      <Separator />

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Reviews ({ratings.filter(r => r.comment).length})
        </h4>

        <ScrollArea className="h-64">
          <div className="space-y-4">
            {ratings
              .filter(rating => rating.comment)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((rating) => (
                <div key={rating.id} className="space-y-2 p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-muted">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(rating.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {rating.comment}
                  </p>
                </div>
              ))}

            {ratings.filter(r => r.comment).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reviews yet</p>
                <p className="text-xs">Be the first to leave a comment!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}