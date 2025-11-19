import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  const discussions = [
    {
      id: 1,
      title: "Best warming spices for Vata season?",
      author: "Sarah M.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      replies: 12,
      likes: 8,
      timeAgo: "2 hours ago",
      category: "Seasonal Wellness",
      preview: "I'm struggling with the cold weather and feeling scattered. What spices do you recommend for staying grounded and warm?",
      isExpert: false
    },
    {
      id: 2,
      title: "Kitchari variations for Pitta constitution",
      author: "Dr. Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      replies: 18,
      likes: 24,
      timeAgo: "4 hours ago",
      category: "Recipes",
      preview: "Here are some cooling variations of traditional kitchari that work wonderfully for Pitta types during summer months...",
      isExpert: true
    },
    {
      id: 3,
      title: "Managing work stress with Ayurvedic practices",
      author: "Michael R.",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      replies: 15,
      likes: 19,
      timeAgo: "6 hours ago",
      category: "Lifestyle",
      preview: "As a Vata-Pitta type working in tech, I've found these practices incredibly helpful for managing deadline stress...",
      isExpert: false
    }
  ];

  const recipes = [
    {
      id: 1,
      title: "Golden Milk Latte (Vata-Pacifying)",
      author: "Lisa K.",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300&h=200&fit=crop",
      likes: 32,
      saves: 18,
      timeAgo: "1 day ago",
      difficulty: "Easy",
      prepTime: "10 min"
    },
    {
      id: 2,
      title: "Cooling Cucumber Raita",
      author: "Raj P.",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      image: "https://images.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg?w=300&h=200&fit=crop",
      likes: 28,
      saves: 22,
      timeAgo: "2 days ago",
      difficulty: "Easy",
      prepTime: "15 min"
    },
    {
      id: 3,
      title: "Tri-Doshic Vegetable Soup",
      author: "Chef Maya",
      avatar: "https://randomuser.me/api/portraits/women/40.jpg",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      likes: 45,
      saves: 31,
      timeAgo: "3 days ago",
      difficulty: "Medium",
      prepTime: "45 min"
    }
  ];

  const successStories = [
    {
      id: 1,
      title: "3 Months of Constitutional Eating: My Journey",
      author: "Jennifer L.",
      avatar: "https://randomuser.me/api/portraits/women/38.jpg",
      excerpt: "After struggling with digestive issues for years, following my Vata-Pitta meal plan has been transformative. My energy is stable, sleep has improved, and I finally feel in tune with my body's needs.",
      likes: 67,
      comments: 23,
      timeAgo: "1 week ago",
      tags: ["Digestion", "Energy", "Success Story"]
    },
    {
      id: 2,
      title: "From Burnout to Balance: A Tech Professional\'s Story",
      author: "David C.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      excerpt: "Working 80-hour weeks was destroying my health. Learning about my constitution and implementing daily routines changed everything. Now I\'m more productive and actually enjoy my work again.",
      likes: 89,
      comments: 34,
      timeAgo: "2 weeks ago",
      tags: ["Stress Management", "Work-Life Balance", "Routine"]
    }
  ];

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: 'MessageCircle', count: 24 },
    { id: 'recipes', label: 'Recipe Sharing', icon: 'ChefHat', count: 18 },
    { id: 'stories', label: 'Success Stories', icon: 'Heart', count: 12 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <div className="space-y-4">
            {discussions?.map((discussion) => (
              <div key={discussion?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Image
                      src={discussion?.avatar}
                      alt={discussion?.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {discussion?.isExpert && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                        <Icon name="Star" size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-primary text-sm">{discussion?.title}</h5>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {discussion?.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-text-secondary">{discussion?.author}</span>
                      {discussion?.isExpert && (
                        <span className="text-xs bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">
                          Expert
                        </span>
                      )}
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">{discussion?.timeAgo}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {discussion?.preview}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="MessageCircle" size={14} />
                        <span>{discussion?.replies} replies</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Heart" size={14} />
                        <span>{discussion?.likes} likes</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Share2" size={14} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'recipes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes?.map((recipe) => (
              <div key={recipe?.id} className="bg-muted rounded-lg overflow-hidden">
                <div className="relative h-32">
                  <Image
                    src={recipe?.image}
                    alt={recipe?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-primary">{recipe?.prepTime}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="font-semibold text-primary text-sm mb-1">{recipe?.title}</h5>
                  <div className="flex items-center space-x-2 mb-2">
                    <Image
                      src={recipe?.avatar}
                      alt={recipe?.author}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-text-secondary">{recipe?.author}</span>
                    <span className="text-xs text-text-secondary">•</span>
                    <span className="text-xs text-text-secondary">{recipe?.timeAgo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Heart" size={12} />
                        <span>{recipe?.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Bookmark" size={12} />
                        <span>{recipe?.saves}</span>
                      </button>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {recipe?.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'stories':
        return (
          <div className="space-y-4">
            {successStories?.map((story) => (
              <div key={story?.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Image
                    src={story?.avatar}
                    alt={story?.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-primary text-sm mb-1">{story?.title}</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-text-secondary">{story?.author}</span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">{story?.timeAgo}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-3">
                      {story?.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Heart" size={14} />
                        <span>{story?.likes} likes</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="MessageCircle" size={14} />
                        <span>{story?.comments} comments</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-text-secondary hover:text-primary organic-transition">
                        <Icon name="Share2" size={14} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl organic-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-primary mb-1">
            Community Hub
          </h3>
          <p className="text-sm text-text-secondary">
            Connect with others on similar constitutional journeys
          </p>
        </div>
        <Button variant="default" size="sm" iconName="Plus" iconPosition="left">
          Start Discussion
        </Button>
      </div>
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium organic-transition ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-primary hover:bg-background/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
            <span className="text-xs opacity-70">({tab?.count})</span>
          </button>
        ))}
      </div>
      {renderContent()}
      <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-3">
          <Icon name="Users" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-1">Community Guidelines</h5>
            <p className="text-sm text-text-secondary mb-2">
              Our community is moderated by certified Ayurvedic practitioners. Share experiences, ask questions, and support each other's wellness journey.
            </p>
            <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
              Read Full Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;