'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Hash, Globe } from 'lucide-react';
import { useTags } from '@/hooks/use-tags';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  selectedTags: string[];
  selectedLanguage: string;
  onTagToggle: (tag: string) => void;
  onLanguageChange: (language: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const LANGUAGES = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'Bengali' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export function TagFilter({
  selectedTags,
  selectedLanguage,
  onTagToggle,
  onLanguageChange,
  onClearFilters,
  className
}: TagFilterProps) {
  const { data: tags, isLoading } = useTags();
  console.log("Tags:", tags);

  const hasActiveFilters = selectedTags.length > 0 || (selectedLanguage !== '' && selectedLanguage !== 'all');

  const handleLanguageChange = (value: string) => {
    // Convert 'all' back to empty string for the parent component
    onLanguageChange(value === 'all' ? '' : value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Language Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Globe className="w-4 h-4" />
          Language
        </div>
        <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Tag Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Hash className="w-4 h-4" />
            Tags
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-7 px-2 text-xs hover:bg-red-50 hover:text-red-600"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Selected:</p>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="text-xs cursor-pointer bg-purple-600 hover:bg-purple-700"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Tags */}
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-6 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              tags?.map((tag) => {
                const isSelected = selectedTags.includes(tag.name.toLowerCase());
                return (
                  <div
                    key={tag.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
                      "hover:bg-muted/50",
                      isSelected && "bg-purple-50 border border-purple-200"
                    )}
                    onClick={() => onTagToggle(tag.name.toLowerCase())}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isSelected ? "bg-purple-600" : "bg-muted-foreground/30"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isSelected ? "font-medium text-purple-700" : "text-foreground"
                      )}>
                        {tag.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tag.count}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}