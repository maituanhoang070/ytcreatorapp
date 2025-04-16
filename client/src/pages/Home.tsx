import { useState } from "react";
import WelcomeCard from "@/components/home/WelcomeCard";
import ChannelSetupForm from "@/components/home/ChannelSetupForm";
import TrendAnalysisSection from "@/components/home/TrendAnalysisSection";
import ContentGenerationSection from "@/components/home/ContentGenerationSection";

export default function Home() {
  // Track the active step (1: Channel Setup, 2: Trend Analysis, 3: Content Generation)
  const [activeStep, setActiveStep] = useState(1);
  // Store channel settings ID after submission
  const [channelSettingsId, setChannelSettingsId] = useState<number | null>(null);
  // Store userId after login/registration (in a real app, this would come from auth)
  const [userId, setUserId] = useState<number | null>(1); // Default to 1 for demo
  // Store the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // Show/hide the welcome card
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);

  // Handle channel setup form submission
  const handleChannelSetupSubmit = (settingsId: number, category: string) => {
    setChannelSettingsId(settingsId);
    setSelectedCategory(category);
    setActiveStep(2);
  };

  // Handle trend analysis completion
  const handleTrendAnalysisComplete = () => {
    setActiveStep(3);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {showWelcomeCard && (
        <WelcomeCard 
          activeStep={activeStep} 
          onClose={() => setShowWelcomeCard(false)} 
        />
      )}

      <ChannelSetupForm 
        userId={userId}
        isActive={activeStep === 1} 
        onComplete={handleChannelSetupSubmit}
      />

      <TrendAnalysisSection
        userId={userId}
        channelSettingsId={channelSettingsId}
        category={selectedCategory}
        isActive={activeStep === 2}
        onComplete={handleTrendAnalysisComplete}
      />

      <ContentGenerationSection
        userId={userId}
        category={selectedCategory}
        isActive={activeStep === 3}
      />
    </div>
  );
}
