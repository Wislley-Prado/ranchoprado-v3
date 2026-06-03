
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Camera, 
  Settings, 
  MessageCircle, 
  Heart, 
  Users,
  Download,
  Bell,
  BellOff,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  Star
} from 'lucide-react';

const StreamControls = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [rating, setRating] = useState(0);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transmissão ao Vivo - Rio São Francisco',
        text: 'Acompanhe as condições do rio em tempo real no Rancho Prado',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aqui você poderia mostrar um toast de sucesso
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleNotifications = () => {
    setNotifications(!notifications);
  };

  const handleRating = (stars: number) => {
    setRating(stars);
  };

  const qualityOptions = ['480p', '720p', '1080p'];

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side - Interaction */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLike}
            className={`${liked ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            {liked ? '248' : '247'}
          </Button>

          <Button 
            size="sm" 
            variant="outline"
            onClick={handleBookmark}
            className={`${bookmarked ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-1 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4 mr-1" />
            )}
            Salvar
          </Button>

          <Button 
            size="sm" 
            variant="outline"
            onClick={handleNotifications}
            className={`${notifications ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : ''}`}
          >
            {notifications ? (
              <Bell className="h-4 w-4 mr-1 fill-current" />
            ) : (
              <BellOff className="h-4 w-4 mr-1" />
            )}
            Notificar
          </Button>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            127 assistindo
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Camera className="h-4 w-4 mr-1" />
            Capturar
          </Button>

          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Salvar
          </Button>

          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>

          <div className="flex items-center space-x-1">
            <Settings className="h-4 w-4 text-gray-500" />
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="text-sm border rounded px-2 py-1 bg-white"
            >
              {qualityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stream Info Row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800">
            Conexão Estável
          </Badge>
          <span className="text-gray-600">
            Latência: 2.3s
          </span>
          <span className="text-gray-600">
            Bitrate: 2500 kbps
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-600 text-xs mr-2">Avaliar:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`p-1 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
            >
              <Star className={`h-3 w-3 ${rating >= star ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions for Mobile */}
      <div className="lg:hidden flex items-center justify-center space-x-2">
        <Button size="sm" variant="ghost" className="text-xs">
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
        <Button size="sm" variant="ghost" className="text-xs">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Curtir
        </Button>
        <Button size="sm" variant="ghost" className="text-xs" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default StreamControls;
