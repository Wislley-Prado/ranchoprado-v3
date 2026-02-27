
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img 
          src={getOptimizedUrl(post.image, 800)} 
          srcSet={`${getOptimizedUrl(post.image, 400)} 400w, ${getOptimizedUrl(post.image, 800)} 800w`}
          sizes="(max-width: 768px) 400px, 800px"
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="bg-rio-blue text-white px-2 py-1 rounded-full text-xs">
            {post.category}
          </span>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{post.date}</span>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-rio-blue transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center text-rio-blue text-sm font-medium group-hover:text-sunset-orange transition-colors">
            Ler mais
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
