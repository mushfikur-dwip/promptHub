'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Copy, Trash2, Download, Calendar, FileText, Loader2, Lamp as Empty } from 'lucide-react';
import { toast } from 'sonner';
import { useUserLibrary } from '@/hooks/use-user-library';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface UserLibraryProps {
  className?: string;
}

export function UserLibrary({ className }: UserLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { savedPrompts, isLoading, stats, removePrompt, exportLibrary } = useUserLibrary();

  const handleCopy = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`"${title}" copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleRemove = async (promptId: string, title: string) => {
    const success = await removePrompt(promptId);
    if (success) {
      toast.success(`"${title}" removed from library`);
    }
  };

  const handleExport = async () => {
    await exportLibrary();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "fixed bottom-6 right-6 z-50 h-14 px-4 rounded-full shadow-lg",
            "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
            "hover:from-purple-700 hover:to-blue-700 border-0",
            "transition-all duration-300 hover:scale-105 hover:shadow-xl",
            className
          )}
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Library
          {stats.count > 0 && (
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
              {stats.count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Your Library
          </SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            <span>
              {stats.count} saved prompt{stats.count !== 1 ? 's' : ''}
              {stats.oldestDate && (
                <span className="text-xs ml-2">
                  (oldest: {formatDistanceToNow(new Date(stats.oldestDate), { addSuffix: true })})
                </span>
              )}
            </span>
            {stats.count > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-8 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            )}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : savedPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">No saved prompts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save prompts from the main page to access them here
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Browse Prompts
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {prompt.title}
                      </h4>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {prompt.language.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {prompt.description}
                    </p>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-muted/50 p-3 rounded border">
                    <pre className="text-xs font-mono text-foreground/80 line-clamp-3 whitespace-pre-wrap">
                      {prompt.content}
                    </pre>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(prompt.saved_at), { addSuffix: true })}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(prompt.content, prompt.title)}
                        className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(prompt.id, prompt.title)}
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Auto-purge notice */}
        {stats.count > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Note:</strong> Saved prompts are automatically removed after 30 days.
              Export your library to keep a permanent copy.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}