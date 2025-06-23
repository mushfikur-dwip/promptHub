"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RatingSystem } from "@/components/rating-system";
import {
  ArrowLeft,
  Copy,
  BookmarkPlus,
  ExternalLink,
  Calendar,
  Globe,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { PromptWithTags } from "@/lib/supabase";
import { useUserLibrary } from "@/hooks/use-user-library";
import { getUserId } from "@/lib/user-id";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params.id as string;

  const [prompt, setPrompt] = useState<PromptWithTags | null>(null);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    average_rating: 0,
    total_ratings: 0,
    ratings_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);

  const { savePrompt, isPromptSaved } = useUserLibrary();

  useEffect(() => {
    if (promptId) {
      loadPromptData();
    }
  }, [promptId]);

  const loadPromptData = async () => {
    setIsLoading(true);
    try {
      // Load prompt details
      const promptResponse = await fetch(`/api/prompts/${promptId}`);
      if (!promptResponse.ok) {
        throw new Error("Failed to fetch prompt");
      }
      const promptData = await promptResponse.json();
      setPrompt(promptData);

      // Load ratings
      const ratingsResponse = await fetch(`/api/prompts/${promptId}/ratings`);
      if (ratingsResponse.ok) {
        const ratingsData = await ratingsResponse.json();
        setRatings(ratingsData);
      }

      // Load stats
      const statsResponse = await fetch(`/api/prompts/${promptId}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to load prompt:", error);
      toast.error("Failed to load prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt");
    } finally {
      setIsCopying(false);
    }
  };

  const handleSave = async () => {
    if (!prompt) return;

    if (isPromptSaved(prompt.id)) {
      toast.info("Already in your library");
      return;
    }

    await savePrompt({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      language: prompt.language,
      creator_name: prompt.creator_name,
      creator_avatar: prompt.creator_avatar,
    });
  };

  const handleTry = () => {
    if (!prompt) return;

    const encodedPrompt = encodeURIComponent(prompt.content);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    window.open(chatGPTUrl, "_blank", "noopener,noreferrer");
  };

  const handleRatingSubmit = async (rating: number, comment?: string) => {
    const userId = getUserId();

    const response = await fetch(`/api/prompts/${promptId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit rating");
    }

    // ✅ সাবমিটের পর আলাদা করে ফেচ করো
    try {
      const ratingsRes = await fetch(`/api/prompts/${promptId}/ratings`);
      const statsRes = await fetch(`/api/prompts/${promptId}/stats`);

      if (ratingsRes.ok) {
        const ratingsData = await ratingsRes.json();
        setRatings(ratingsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to reload rating data", err);
    }
  };
  
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Prompt Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold leading-tight mb-3">
                    {prompt.title}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {prompt.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="bg-white/50">
                    <Globe className="w-3 h-3 mr-1" />
                    {prompt.language.toUpperCase()}
                  </Badge>
                  {stats.total_ratings > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {stats.average_rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({stats.total_ratings})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-10 h-10 border border-border/50">
                  <AvatarImage
                    src={prompt.creator_avatar || undefined}
                    alt={prompt.creator_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
                    {prompt.creator_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{prompt.creator_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {/* {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })} */}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={isCopying}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {isCopying ? "Copying..." : "Copy"}
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
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Try
                </Button>
              </div>
            </div>

            {/* Prompt Content */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="font-semibold mb-4">Prompt Content</h2>
              <div className="bg-muted/50 p-4 rounded-lg border">
                <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {prompt.content}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar - Rating System */}
          <div className="md:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 sticky top-8">
              <RatingSystem
                key={`${prompt.id}-${stats.total_ratings}`}
                promptId={prompt.id}
                ratings={ratings}
                stats={stats}
                onRatingSubmit={handleRatingSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// This is a client-side component that fetches and displays prompt details, ratings, and allows users to rate prompts.