'use client';

import React, { useState, useEffect } from 'react';
import { PromptCard } from '@/components/prompt-card';
import { TagFilter } from '@/components/tag-filter';
import { UserLibrary } from '@/components/user-library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  BookOpen, 
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  PenTool
} from 'lucide-react';
import { usePrompts } from '@/hooks/use-prompts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: prompts, isLoading, error } = usePrompts({
    tags: selectedTags,
    language: selectedLanguage
  });

  // Filter prompts by search query
  const filteredPrompts = prompts?.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    updateURL(
      selectedTags.includes(tag) 
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag],
      selectedLanguage
    );
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    updateURL(selectedTags, language);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedLanguage('');
    setSearchQuery('');
    updateURL([], '');
  };

  const updateURL = (tags: string[], language: string) => {
    const url = new URL(window.location.href);
    if (tags.length > 0) {
      url.searchParams.set('tags', tags.join(','));
    } else {
      url.searchParams.delete('tags');
    }
    if (language) {
      url.searchParams.set('language', language);
    } else {
      url.searchParams.delete('language');
    }
    window.history.replaceState({}, '', url.toString());
  };

  // Load filters from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const tagsParam = url.searchParams.get('tags');
    const languageParam = url.searchParams.get('language');
    
    if (tagsParam) {
      setSelectedTags(tagsParam.split(',').filter(Boolean));
    }
    if (languageParam) {
      setSelectedLanguage(languageParam);
    }
  }, []);

  // Listen for tag filter changes from PromptCard
  useEffect(() => {
    const handleTagFilterChanged = () => {
      const url = new URL(window.location.href);
      const tagsParam = url.searchParams.get('tags');
      if (tagsParam) {
        setSelectedTags(tagsParam.split(',').filter(Boolean));
      }
    };

    window.addEventListener('tagFilterChanged', handleTagFilterChanged);
    return () => window.removeEventListener('tagFilterChanged', handleTagFilterChanged);
  }, []);

  const stats = {
    totalPrompts: prompts?.length || 0,
    avgRating: prompts && prompts.length > 0 
      ? prompts.reduce((acc, p) => acc + p.rating_stats.average_rating, 0) / prompts.length 
      : 0,
    totalRatings: prompts?.reduce((acc, p) => acc + p.rating_stats.total_ratings, 0) || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Discover Amazing AI Prompts
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
              Find, save, and share high-quality prompts for ChatGPT and other AI tools. 
              Community-driven with ratings and reviews.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/create">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8">
                  <PenTool className="w-5 h-5 mr-2" />
                  Publish Your Prompt
                </Button>
              </Link>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8">
                <Search className="w-5 h-5 mr-2" />
                Browse Prompts
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {/* <BookOpen className="w-5 h-5" /> */}
                  <span className="text-2xl font-bold">{stats.totalPrompts}</span>
                </div>
                <p className="text-sm text-purple-100">Prompts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {/* <Star className="w-5 h-5" /> */}
                  <span className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-purple-100">Average Rating</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {/* <Users className="w-5 h-5" /> */}
                  <span className="text-2xl font-bold">{stats.totalRatings}</span>
                </div>
                <p className="text-sm text-purple-100"> Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={cn(
            "lg:col-span-1",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  ✕
                </Button>
              </div>
              
              <TagFilter
                selectedTags={selectedTags}
                selectedLanguage={selectedLanguage}
                onTagToggle={handleTagToggle}
                onLanguageChange={handleLanguageChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg  border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id='search-prompts'
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 border-none outline-none focus:ring-2  transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden bg-white/50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(selectedTags.length > 0 || selectedLanguage) && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedTags.length + (selectedLanguage ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedTags.length > 0 || selectedLanguage || searchQuery) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedLanguage && (
                    <Badge variant="default" className="bg-purple-600">
                      Language: {selectedLanguage.toUpperCase()}
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="default" className="bg-blue-600">
                      {tag}
                    </Badge>
                  ))}
                  {searchQuery && (
                    <Badge variant="default" className="bg-green-600">
                      Search: {searchQuery}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white/50 rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-32 bg-muted rounded mb-4" />
                      <div className="flex justify-between">
                        <div className="h-8 w-24 bg-muted rounded" />
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-muted rounded" />
                          <div className="h-8 w-8 bg-muted rounded" />
                          <div className="h-8 w-8 bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-600 font-medium mb-2">Failed to load prompts</p>
                    <p className="text-red-500 text-sm">Please try refreshing the page</p>
                  </div>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No prompts found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                      <Link href="/create">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Prompt
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Sorted by newest
                    </div>
                  </div>

                  <div className="grid gap-6 items-start md:grid-cols-3 ">
                    {filteredPrompts.map((prompt) => (
                      // <Link 
                      //   key={prompt.id} 
                      //   href={`/prompts/${prompt.id}`}
                      //   className="group"
                      // >
                        <PromptCard 
                          prompt={prompt} 
                          className=" transition-all duration-300 group-hover:scale-[1.02]"
                        />
                      // </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Library FAB */}
      <UserLibrary />
    </div>
  );
}