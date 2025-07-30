import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Bell, Bot, Moon, Sun, HelpCircle } from "lucide-react";
import { useState } from "react";
import AIAssistantModal from "@/components/ai-assistant/ai-assistant-modal";
import { useTour } from "@/hooks/useTour";
import ApplicationTour from "@/components/tour/application-tour";

export default function TopBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { showTour, startTour, closeTour } = useTour();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAIAssistant = () => {
    setShowAIAssistant(true);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Help Tour Button */}
          <Button 
            onClick={() => startTour()}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
            title="Take a tour"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* AI Assistant Button */}
          <Button 
            onClick={handleAIAssistant}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
          
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {((stats as any)?.unreadMessages || 0) > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {(stats as any)?.unreadMessages}
                </Badge>
              )}
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-gray-400 hover:text-gray-600"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <AIAssistantModal 
        open={showAIAssistant} 
        onOpenChange={setShowAIAssistant} 
      />
      
      <ApplicationTour 
        isOpen={showTour}
        onClose={closeTour}
      />
    </header>
  );
}
