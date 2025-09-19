import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'all', name: 'All Videos', count: 24 },
    { id: 'fundamentals', name: 'Fundamentals', count: 8 },
    { id: 'clinical', name: 'Clinical Practice', count: 6 },
    { id: 'nutrition', name: 'Nutrition Science', count: 5 },
    { id: 'case-studies', name: 'Case Studies', count: 5 }
  ];

  const videos = [
    {
      id: 1,
      title: 'Understanding the Three Doshas: A Modern Perspective',
      description: 'Dr. Priya Sharma explains how ancient dosha theory applies to contemporary nutritional science and patient care.',
      duration: '12:45',
      category: 'fundamentals',
      instructor: 'Dr. Priya Sharma',
      credentials: 'MD, Ayurveda Specialist',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
      views: '15.2K',
      rating: 4.9,
      topics: ['Vata Constitution', 'Pitta Balance', 'Kapha Characteristics', 'Clinical Assessment']
    },
    {
      id: 2,
      title: 'Food Energetics: Rasa, Virya, and Vipaka Explained',
      description: 'Master the sophisticated principles that govern how foods affect our body and mind according to Ayurvedic science.',
      duration: '18:30',
      category: 'nutrition',
      instructor: 'Dr. Rajesh Kumar',
      credentials: 'PhD Nutrition, BAMS',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop',
      views: '12.8K',
      rating: 4.8,
      topics: ['Six Tastes', 'Food Potency', 'Post-Digestive Effects', 'Therapeutic Applications']
    },
    {
      id: 3,
      title: 'Integrating Ayurveda in Clinical Practice: A Case Study Approach',
      description: 'Real-world examples of how healthcare professionals successfully integrate Ayurvedic principles with modern medicine.',
      duration: '25:15',
      category: 'clinical',
      instructor: 'Dr. Sarah Mitchell',
      credentials: 'MD Internal Medicine, CAP',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop',
      views: '9.5K',
      rating: 4.7,
      topics: ['Patient Assessment', 'Treatment Planning', 'Outcome Measurement', 'Documentation']
    },
    {
      id: 4,
      title: 'Seasonal Nutrition: Adapting Diet Throughout the Year',
      description: 'Learn how to adjust nutritional recommendations based on seasonal changes and individual constitution.',
      duration: '14:20',
      category: 'nutrition',
      instructor: 'Dr. Meera Patel',
      credentials: 'MS Nutrition, Ayurveda Consultant',
      thumbnail: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=225&fit=crop',
      views: '11.3K',
      rating: 4.9,
      topics: ['Seasonal Doshas', 'Food Selection', 'Meal Planning', 'Lifestyle Adjustments']
    },
    {
      id: 5,
      title: 'Digestive Fire (Agni): The Key to Optimal Health',
      description: 'Understanding digestive capacity and how to optimize it for better health outcomes in your patients.',
      duration: '16:45',
      category: 'fundamentals',
      instructor: 'Dr. Amit Gupta',
      credentials: 'BAMS, MD Ayurveda',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
      views: '13.7K',
      rating: 4.8,
      topics: ['Agni Types', 'Digestive Assessment', 'Therapeutic Interventions', 'Dietary Guidelines']
    },
    {
      id: 6,
      title: 'Diabetes Management: Ayurvedic and Modern Approaches',
      description: 'A comprehensive case study showing integrated treatment protocols for diabetes management.',
      duration: '22:10',
      category: 'case-studies',
      instructor: 'Dr. Lisa Chen',
      credentials: 'MD Endocrinology, CAP',
      thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=225&fit=crop',
      views: '8.9K',
      rating: 4.6,
      topics: ['Blood Sugar Management', 'Dietary Protocols', 'Herbal Support', 'Lifestyle Medicine']
    }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos?.filter(video => video?.category === selectedCategory);

  const VideoCard = ({ video }) => (
    <div 
      className="bg-background rounded-xl organic-shadow hover:elevated-shadow organic-transition cursor-pointer"
      onClick={() => setSelectedVideo(video)}
    >
      <div className="relative">
        <Image
          src={video?.thumbnail}
          alt={video?.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-black/20 rounded-t-xl flex items-center justify-center opacity-0 hover:opacity-100 organic-transition">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <Icon name="Play" size={24} className="text-primary ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {video?.duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-primary mb-2 line-clamp-2">
          {video?.title}
        </h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {video?.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-sage/20 rounded-full flex items-center justify-center">
              <Icon name="User" size={14} className="text-brand-sage" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary">{video?.instructor}</div>
              <div className="text-xs text-text-secondary">{video?.credentials}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <Icon name="Star" size={14} className="text-brand-gold fill-current" />
            <span>{video?.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={14} />
            <span>{video?.views} views</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {video?.topics?.slice(0, 2)?.map((topic, index) => (
              <span key={index} className="bg-muted px-2 py-1 rounded-full text-xs">
                {topic}
              </span>
            ))}
            {video?.topics?.length > 2 && (
              <span className="text-xs text-text-secondary">+{video?.topics?.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const VideoModal = ({ video, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-primary">
            {video?.title}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="aspect-video bg-muted rounded-xl mb-6 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Play" size={48} className="text-brand-gold mx-auto mb-2" />
              <p className="text-text-secondary">Video Player Placeholder</p>
              <p className="text-sm text-text-secondary mt-1">Duration: {video?.duration}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">Description</h3>
                <p className="text-text-secondary">{video?.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {video?.topics?.map((topic, index) => (
                    <span key={index} className="bg-brand-sage/20 text-brand-sage px-3 py-1 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-primary mb-3">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-brand-sage" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">{video?.instructor}</div>
                    <div className="text-sm text-text-secondary">{video?.credentials}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-primary mb-3">Video Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Views</span>
                    <span className="font-medium">{video?.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-brand-gold fill-current" />
                      <span className="font-medium">{video?.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-medium">{video?.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-semibold text-primary mb-3">
          Expert Video Library
        </h2>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Learn from respected Ayurvedic practitioners and integrative medicine experts 
          who bridge ancient wisdom with modern clinical practice.
        </p>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`px-4 py-2 rounded-full organic-transition ${
              selectedCategory === category?.id
                ? 'bg-brand-gold text-white' :'bg-muted text-text-secondary hover:bg-brand-gold/20 hover:text-primary'
            }`}
          >
            {category?.name} ({category?.count})
          </button>
        ))}
      </div>
      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos?.map((video) => (
          <VideoCard key={video?.id} video={video} />
        ))}
      </div>
      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Load More Videos
        </Button>
      </div>
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
};

export default VideoLibrary;