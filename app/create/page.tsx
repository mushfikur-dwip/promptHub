"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  X,
  Send,
  Loader2,
  Eye,
  Globe,
  Hash,
  User,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Link,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "bn", name: "Bengali" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

const SUGGESTED_TAGS = [
  "SEO",
  "Copywriting",
  "Marketing",
  "Business",
  "Creative Writing",
  "Social Media",
  "Email",
  "Technical",
  "Education",
  "Analysis",
  "Content Strategy",
  "Productivity",
  "Translation",
  "Funny",
  "Bengali",
];

export default function CreatePromptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    language: "en",
    creator_name: "",
    creator_avatar: "",
    image_url: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tagName: string) => {
    const normalizedTag = tagName.trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags((prev) => [...prev, normalizedTag]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter the prompt content");
      return;
    }
    if (formData.description.length > 200) {
      toast.error("Description must be 200 characters or less");
      return;
    }

    // Validate image URL if provided
    if (formData.image_url.trim()) {
      try {
        new URL(formData.image_url.trim());
      } catch {
        toast.error("Please enter a valid image URL");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("language", formData.language);
      formDataToSend.append(
        "creator_name",
        formData.creator_name || "Anonymous"
      );
      formDataToSend.append("creator_avatar", formData.creator_avatar);
      formDataToSend.append("image_url", formData.image_url);
      formDataToSend.append("tags", JSON.stringify(tags));

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create prompt");
      }

      const newPrompt = await response.json();
      toast.success("Prompt published successfully!");
      router.push(`/prompts/${newPrompt.id}`);
    } catch (error) {
      console.error("Failed to create prompt:", error);
      toast.error("Failed to publish prompt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.content.trim();

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

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Publish Your Prompt
            </h1>
            <p className="text-muted-foreground">
              Share your amazing AI prompt with the community
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Prompt Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      placeholder="Enter a catchy title for your prompt"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      maxLength={100}
                      className="bg-white/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      placeholder="Briefly describe what your prompt does and when to use it"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      maxLength={200}
                      rows={3}
                      className="bg-white/50 resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/200 characters
                    </p>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Image URL (Optional)
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={formData.image_url}
                        onChange={(e) =>
                          handleInputChange("image_url", e.target.value)
                        }
                        className="bg-white/50 pl-10"
                        type="url"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add a visual image to make your prompt more appealing
                    </p>
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.display = "block";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language
                    </label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        handleInputChange("language", value)
                      }
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
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

                  {/* Creator Info */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Creator Information (Optional)
                    </label>
                    <div className="grid gap-3">
                      <Input
                        placeholder="Your name (defaults to 'Anonymous')"
                        value={formData.creator_name}
                        onChange={(e) =>
                          handleInputChange("creator_name", e.target.value)
                        }
                        className="bg-white/50"
                      />
                      <Input
                        placeholder="Avatar URL (optional)"
                        value={formData.creator_avatar}
                        onChange={(e) =>
                          handleInputChange("creator_avatar", e.target.value)
                        }
                        className="bg-white/50"
                        type="url"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="default"
                          className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Custom Tag */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Add Custom Tag:</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag name"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                      className="bg-white/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addTag(newTag)}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Suggested Tags */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.filter(
                      (tag) => !tags.includes(tag.toLowerCase())
                    ).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content & Preview */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Prompt Content
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg border min-h-[300px]">
                      <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-foreground/90">
                        {formData.content ||
                          "Your prompt content will appear here..."}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter your prompt content here. Be specific and include placeholders like [TOPIC] or [KEYWORD] where users should customize..."
                      value={formData.content}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      rows={12}
                      className="bg-white/50 resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Use placeholders like [TOPIC], [KEYWORD], or
                      [COMPANY_NAME] to make your prompt customizable
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Publishing..." : "Publish Prompt"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
