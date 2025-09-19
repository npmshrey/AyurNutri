import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PlanGeneration = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const patientOptions = [
    { value: 'sarah-johnson', label: 'Sarah Johnson (Vata-Pitta)' },
    { value: 'michael-chen', label: 'Michael Chen (Kapha)' },
    { value: 'emma-davis', label: 'Emma Davis (Pitta-Vata)' },
    { value: 'robert-wilson', label: 'Robert Wilson (Vata)' }
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  const foodItems = [
    {
      id: 1,
      name: "Quinoa Bowl",
      category: "Grains",
      calories: 220,
      protein: 8,
      carbs: 39,
      fat: 4,
      doshaCompatibility: ["Vata", "Pitta"],
      ayurvedicProperties: {
        rasa: "Sweet",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Steamed Vegetables",
      category: "Vegetables",
      calories: 85,
      protein: 3,
      carbs: 17,
      fat: 1,
      doshaCompatibility: ["Vata", "Pitta", "Kapha"],
      ayurvedicProperties: {
        rasa: "Sweet, Bitter",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Ghee",
      category: "Fats",
      calories: 112,
      protein: 0,
      carbs: 0,
      fat: 12,
      doshaCompatibility: ["Vata", "Pitta"],
      ayurvedicProperties: {
        rasa: "Sweet",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      name: "Mung Dal",
      category: "Legumes",
      calories: 347,
      protein: 24,
      carbs: 59,
      fat: 1,
      doshaCompatibility: ["Vata", "Pitta", "Kapha"],
      ayurvedicProperties: {
        rasa: "Sweet, Astringent",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=100&h=100&fit=crop"
    },
    {
      id: 5,
      name: "Basmati Rice",
      category: "Grains",
      calories: 205,
      protein: 4,
      carbs: 45,
      fat: 0,
      doshaCompatibility: ["Vata", "Pitta"],
      ayurvedicProperties: {
        rasa: "Sweet",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop"
    },
    {
      id: 6,
      name: "Coconut Oil",
      category: "Fats",
      calories: 117,
      protein: 0,
      carbs: 0,
      fat: 14,
      doshaCompatibility: ["Pitta", "Kapha"],
      ayurvedicProperties: {
        rasa: "Sweet",
        virya: "Cooling",
        vipaka: "Sweet"
      },
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&h=100&fit=crop"
    }
  ];

  const [mealPlan, setMealPlan] = useState([]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    if (draggedItem) {
      setMealPlan(prev => [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  const removeMealItem = (itemId) => {
    setMealPlan(prev => prev?.filter(item => item?.id !== itemId));
  };

  const calculateTotalNutrition = () => {
    return mealPlan?.reduce((total, item) => ({
      calories: total?.calories + item?.calories,
      protein: total?.protein + item?.protein,
      carbs: total?.carbs + item?.carbs,
      fat: total?.fat + item?.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getDoshaCompatibilityColor = (doshas) => {
    if (doshas?.length === 3) return 'bg-success/10 text-success';
    if (doshas?.length === 2) return 'bg-warning/10 text-warning';
    return 'bg-primary/10 text-primary';
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Plan Generation</h2>
          <p className="text-text-secondary">Create personalized Ayurvedic nutrition plans</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Save">
            Save Draft
          </Button>
          <Button variant="default" iconName="Send">
            Generate Plan
          </Button>
        </div>
      </div>
      {/* Patient & Meal Selection */}
      <div className="bg-card rounded-lg p-4 border border-border organic-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Patient"
            options={patientOptions}
            value={selectedPatient}
            onChange={setSelectedPatient}
            placeholder="Choose a patient"
            searchable
          />
          <Select
            label="Meal Type"
            options={mealTypeOptions}
            value={selectedMealType}
            onChange={setSelectedMealType}
            placeholder="Select meal type"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food Items Library */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Food Items Library</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Search">
                    Search
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Filter">
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {foodItems?.map((item) => (
                  <div
                    key={item?.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 cursor-move organic-transition"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-text-primary">{item?.name}</h4>
                          <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded">
                            {item?.category}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-2">
                          <span>{item?.calories} cal</span>
                          <span>{item?.protein}g protein</span>
                          <span>{item?.carbs}g carbs</span>
                          <span>{item?.fat}g fat</span>
                        </div>

                        <div className="space-y-1">
                          <div className={`text-xs px-2 py-1 rounded ${getDoshaCompatibilityColor(item?.doshaCompatibility)}`}>
                            {item?.doshaCompatibility?.join(', ')} Compatible
                          </div>
                          <div className="text-xs text-text-secondary">
                            {item?.ayurvedicProperties?.rasa} • {item?.ayurvedicProperties?.virya}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meal Plan Builder */}
        <div className="space-y-4">
          {/* Drop Zone */}
          <div className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Meal Plan Builder</h3>
            </div>
            
            <div
              className="p-4 min-h-64"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {mealPlan?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-border rounded-lg">
                  <Icon name="Plus" size={32} className="text-text-secondary mb-2" />
                  <p className="text-text-secondary">Drag food items here to build meal plan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mealPlan?.map((item, index) => (
                    <div key={`${item?.id}-${index}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <h5 className="font-medium text-text-primary text-sm">{item?.name}</h5>
                          <p className="text-xs text-text-secondary">{item?.calories} cal</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => removeMealItem(item?.id)}
                        className="text-error hover:text-error"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nutritional Analysis */}
          {mealPlan?.length > 0 && (
            <div className="bg-card rounded-lg border border-border organic-shadow">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary">Nutritional Analysis</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Total Calories</span>
                  <span className="font-semibold text-text-primary">{totalNutrition?.calories}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Protein</span>
                  <span className="font-semibold text-text-primary">{totalNutrition?.protein}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Carbohydrates</span>
                  <span className="font-semibold text-text-primary">{totalNutrition?.carbs}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Fat</span>
                  <span className="font-semibold text-text-primary">{totalNutrition?.fat}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Ayurvedic Compatibility Check */}
          {mealPlan?.length > 0 && (
            <div className="bg-card rounded-lg border border-border organic-shadow">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary">Ayurvedic Compatibility</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success">Overall compatibility: Good</span>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p>• Balanced rasa (taste) profile</p>
                  <p>• Suitable virya (potency) for patient's dosha</p>
                  <p>• Compatible food combinations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanGeneration;