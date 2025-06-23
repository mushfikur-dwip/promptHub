'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from "next/link";
import { 
  Copy, 
  BookmarkPlus, 
  ExternalLink, 
  Star,
  Calendar,
  Globe,
  Eye,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { PromptWithStats } from '@/lib/firebase-service';
import { useUserLibrary } from '@/hooks/use-user-library';
import { formatDistanceToNow } from 'date-fns';

interface PromptCardProps {
  prompt: PromptWithStats;
  className?: string;
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { savePrompt, isPromptSaved } = useUserLibrary();

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Copied to clipboard!', {
        description: 'The prompt has been copied and is ready to use.'
      });
    } catch (error) {
      toast.error('Failed to copy prompt');
    } finally {
      setIsCopying(false);
    }
  };

  const handleSave = async () => {
    if (isPromptSaved(prompt.id)) {
      toast.info('Already in your library');
      return;
    }

    await savePrompt({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      language: prompt.language,
      creator_name: prompt.creator_name,
      creator_avatar: prompt.creator_avatar
    });
  };

  const handleTry = () => {
    const encodedPrompt = encodeURIComponent(prompt.content);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    window.open(chatGPTUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTagClick = (tagName: string) => {
    const url = new URL(window.location.href);
    const currentTags = url.searchParams.get('tags')?.split(',').filter(Boolean) || [];
    
    if (!currentTags.includes(tagName.toLowerCase())) {
      currentTags.push(tagName.toLowerCase());
      url.searchParams.set('tags', currentTags.join(','));
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new CustomEvent('tagFilterChanged'));
    }
  };

  const averageRating = prompt.rating_stats.average_rating;
  const totalRatings = prompt.rating_stats.total_ratings;
  const createdAt = prompt.created_at;
  const date = new Date(createdAt.seconds * 1000);
  const newDate = formatDistanceToNow(date, { addSuffix: true });
  // For debugging purposes
  // console.log('Prompt ID:', prompt.id);
  // console.log('Prompt title:', prompt.title);
  // console.log('Prompt content:', prompt.content);
  // console.log('Prompt language:', prompt.language);
  // console.log('Prompt creator:', prompt.creator_name);
  // console.log('Prompt creator avatar:', prompt.creator_avatar);
  // console.log('Prompt image URL:', prompt.image_url);
  // console.log('Prompt tags:', prompt.tags);
  // console.log('Average rating:', averageRating);
  // console.log('Total ratings:', totalRatings);
  // console.log('Created at:', createdAts);

  return (
    <>
      <Card
        className={cn(
          "group h-fit transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1",
          "border-border/50 hover:border-purple-300/50 bg-card/50 backdrop-blur-sm overflow-hidden",
          className
        )}
      >
        {/* Image Section */}
        {prompt.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={prompt.image_url}
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* View Full Prompt Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  View Full
                </Button>
              </DialogTrigger>
            </Dialog>

            {/* Rating overlay */}
            {totalRatings > 0 && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-white/80">({totalRatings})</span>
              </div>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link key={prompt.id} href={`/prompts/${prompt.id}`} passHref>
                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-purple-600 transition-colors hover:underline cursor-pointer">
                  {prompt.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {prompt.description}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant="outline"
                className="text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200 text-purple-700"
              >
                <Globe className="w-3 h-3 mr-1" />
                {prompt.language.toUpperCase()}
              </Badge>
              {!prompt.image_url && totalRatings > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                  <span>({totalRatings})</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {prompt.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        {/* Content Preview (only if no image) */}
        {!prompt.image_url && (
          <CardContent className="pt-0">
            <div className="relative">
              <pre className="text-sm bg-muted/50 p-4 rounded-lg font-mono leading-relaxed whitespace-pre-wrap border border-border/50 text-foreground/90 line-clamp-4">
                {prompt.content.length > 200
                  ? prompt.content.substring(0, 200) + "..."
                  : prompt.content}
              </pre>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-8 text-xs font-medium hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Full Prompt
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardContent>
        )}

        <CardFooter className="pt-0 flex items-center justify-between gap-3">
          {/* Creator Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="w-8 h-8 border border-border/50">
              <AvatarImage
                src={prompt.creator_avatar || undefined}
                alt={prompt.creator_name}
              />
              <AvatarFallback className="text-xs bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                {prompt.creator_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {prompt.creator_name}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {newDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    disabled={isCopying}
                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                  >
                    <Copy
                      className={cn("w-4 h-4", isCopying && "animate-pulse")}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className={cn(
                      "h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600",
                      isPromptSaved(prompt.id) && "text-blue-600 bg-blue-50"
                    )}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isPromptSaved(prompt.id)
                      ? "Already saved"
                      : "Save to library"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTry();
                    }}
                    className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Try in ChatGPT</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
      {/* Full Prompt Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold leading-tight mb-2">
                  {prompt.title}
                </h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {prompt.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200 text-purple-700"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  {prompt.language.toUpperCase()}
                </Badge>
                {totalRatings > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({totalRatings})
                    </span>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Image */}
            {prompt.image_url && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={prompt.image_url}
                  alt={prompt.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-purple-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-border/50">
                <AvatarImage
                  src={prompt.creator_avatar || undefined}
                  alt={prompt.creator_name}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                  {prompt.creator_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{prompt.creator_name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {newDate}
                </p>
              </div>
            </div>

            <Separator />

            {/* Full Content */}
            <div className="space-y-4">
              <h3 className="font-semibold">Prompt Content</h3>
              <ScrollArea className="h-64 w-full rounded-lg border">
                <div className="p-4">
                  <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {prompt.content}
                  </pre>
                </div>
              </ScrollArea>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                disabled={isCopying}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                {isCopying ? "Copying..." : "Copy Prompt"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                className={
                  isPromptSaved(prompt.id)
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : ""
                }
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                {isPromptSaved(prompt.id) ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleTry}>
                <ExternalLink className="w-4 h-4 mr-2 -z-10" />
                Try in ChatGPT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}