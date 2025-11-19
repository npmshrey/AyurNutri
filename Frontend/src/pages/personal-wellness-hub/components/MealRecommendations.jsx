import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MealRecommendations = () => {
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const mealData = {
    breakfast: {
      title: "Energizing Morning Meal",
      description: "Warm, nourishing foods to kindle your digestive fire",
      items: [
        {
          name: "Spiced Oatmeal with Almonds",
          image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300&h=200&fit=crop",
          ayurvedicReason: "Warm, sweet, and grounding - perfect for Vata balance",
          prepTime: "15 min",
          difficulty: "Easy",
          benefits: ["Digestive support", "Sustained energy", "Nervous system nourishment"]
        },
        {
          name: "Golden Milk Smoothie",
          image: "https://images.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg?w=300&h=200&fit=crop",
          ayurvedicReason: "Turmeric and warming spices support immunity and reduce inflammation",
          prepTime: "10 min",
          difficulty: "Easy",
          benefits: ["Anti-inflammatory", "Immune support", "Digestive aid"]
        }
      ]
    },
    lunch: {
      title: "Nourishing Midday Feast",
      description: "Your strongest digestive fire deserves the heartiest meal",
      items: [
        {
          name: "Kitchari with Seasonal Vegetables",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
          ayurvedicReason: "Complete protein with easy digestion - tridoshic balance",
          prepTime: "45 min",
          difficulty: "Medium",
          benefits: ["Complete nutrition", "Easy digestion", "Detoxification"]
        },
        {
          name: "Coconut Dal with Basmati Rice",
          image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop",
          ayurvedicReason: "Cooling coconut balances Pitta while providing protein",
          prepTime: "35 min",
          difficulty: "Medium",
          benefits: ["Protein rich", "Cooling effect", "Heart healthy"]
        }
      ]
    },
    dinner: {
      title: "Gentle Evening Nourishment",
      description: "Light, warm foods to prepare for restful sleep",
      items: [
        {
          name: "Mung Bean Soup with Ginger",
          image: "https://images.pixabay.com/photo/2017/06/16/11/38/soup-2408952_1280.jpg?w=300&h=200&fit=crop",
          ayurvedicReason: "Light, warm, and easy to digest - perfect for evening",
          prepTime: "30 min",
          difficulty: "Easy",
          benefits: ["Light digestion", "Sleep preparation", "Gentle detox"]
        },
        {
          name: "Steamed Vegetables with Quinoa",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
          ayurvedicReason: "Steaming preserves prana while making nutrients accessible",
          prepTime: "25 min",
          difficulty: "Easy",
          benefits: ["Nutrient dense", "Easy digestion", "Satisfying"]
        }
      ]
    }
  };

  const mealTimes = [
    { id: 'breakfast', label: 'Breakfast', time: '7:00 AM', icon: 'Sunrise' },
    { id: 'lunch', label: 'Lunch', time: '12:30 PM', icon: 'Sun' },
    { id: 'dinner', label: 'Dinner', time: '6:30 PM', icon: 'Moon' }
  ];

  return (
    <div className="bg-card rounded-xl organic-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-primary mb-1">
            Today's Meal Recommendations
          </h3>
          <p className="text-sm text-text-secondary">
            Personalized for your Vata-Pitta constitution and current season
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="ShoppingCart" iconPosition="left">
          Generate Shopping List
        </Button>
      </div>
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {mealTimes?.map((meal) => (
          <button
            key={meal?.id}
            onClick={() => setSelectedMeal(meal?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium organic-transition ${
              selectedMeal === meal?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-primary hover:bg-background/50'
            }`}
          >
            <Icon name={meal?.icon} size={16} />
            <span>{meal?.label}</span>
            <span className="text-xs opacity-70">{meal?.time}</span>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-primary mb-1">
          {mealData?.[selectedMeal]?.title}
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          {mealData?.[selectedMeal]?.description}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mealData?.[selectedMeal]?.items?.map((item, index) => (
          <div key={index} className="bg-muted rounded-lg overflow-hidden">
            <div className="relative h-32">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-primary">{item?.prepTime}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-primary">{item?.name}</h5>
                <div className="flex items-center space-x-1">
                  {[...Array(item?.difficulty === 'Easy' ? 1 : 2)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={12} className="text-secondary fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-3 italic">
                "{item?.ayurvedicReason}"
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item?.benefits?.map((benefit, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Recipe
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  Add to Plan
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg border border-secondary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Users" size={20} className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-1">Family Meal Adaptation</h5>
            <p className="text-sm text-text-secondary mb-2">
              These recipes can be easily adapted for your family members with different constitutions.
            </p>
            <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
              Learn How to Adapt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealRecommendations;