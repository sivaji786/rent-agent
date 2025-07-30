import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Home, 
  Building, 
  Users, 
  Wrench, 
  DollarSign, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Bot,
  Bell,
  Settings,
  HelpCircle
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface ApplicationTourProps {
  isOpen: boolean;
  onClose: () => void;
  startFromStep?: number;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Prolits",
    description: "Your comprehensive property management platform. Let's take a quick tour to get you started with managing your properties, tenants, and finances efficiently.",
    icon: Home,
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    description: "Your central hub displays key metrics, revenue trends, and important notifications. Monitor your entire portfolio at a glance with real-time data and insights.",
    icon: BarChart3,
  },
  {
    id: "properties",
    title: "Property Management",
    description: "Add and manage all your properties here. Track occupancy rates, property details, and unit information. Each property can contain multiple units with individual lease tracking.",
    icon: Building,
    action: "Navigate to Properties page to add your first property"
  },
  {
    id: "tenants",
    title: "Tenant Management",
    description: "Manage tenant information, lease agreements, and contact details. Track lease terms, renewal dates, and tenant communication history.",
    icon: Users,
    action: "Add tenants and associate them with specific units"
  },
  {
    id: "maintenance",
    title: "Maintenance Requests",
    description: "Handle maintenance requests efficiently. Tenants can submit requests, you can assign priorities, track progress, and maintain detailed records of all repairs.",
    icon: Wrench,
    action: "Create maintenance requests and assign them to staff"
  },
  {
    id: "financials",
    title: "Financial Tracking",
    description: "Monitor rent payments, track expenses, and generate financial reports. Keep detailed records of all income and expenses for tax and accounting purposes.",
    icon: DollarSign,
    action: "Record payments and track financial performance"
  },
  {
    id: "documents",
    title: "Document Management",
    description: "Store and organize important documents like leases, inspection reports, and certificates. Upload files securely and associate them with properties, units, or tenants.",
    icon: FileText,
    action: "Upload documents and organize your files"
  },
  {
    id: "communication",
    title: "Messages & Communication",
    description: "Centralized messaging system for tenant communication. Send announcements, respond to inquiries, and maintain communication history.",
    icon: MessageSquare,
    action: "Send messages and manage tenant communications"
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    description: "Generate comprehensive reports on occupancy, revenue, maintenance costs, and tenant activity. Export data for accounting or analysis purposes.",
    icon: BarChart3,
    action: "Generate reports to analyze your portfolio performance"
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Get intelligent recommendations and insights. The AI assistant helps with decision-making, identifies optimization opportunities, and provides actionable suggestions.",
    icon: Bot,
    action: "Click the purple AI Assistant button for help and insights"
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Stay updated with important alerts about lease renewals, maintenance requests, overdue payments, and system notifications.",
    icon: Bell,
    action: "Check the notification bell for important updates"
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Ready to begin? Start by adding your first property, then add units and tenants. The system will guide you through each step of the setup process.",
    icon: Settings,
    action: "Begin with Properties → Add New Property"
  }
];

export default function ApplicationTour({ isOpen, onClose, startFromStep = 0 }: ApplicationTourProps) {
  const [currentStep, setCurrentStep] = useState(startFromStep);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('prolits-tour-completed');
    if (!hasVisited && isOpen) {
      setIsFirstVisit(true);
    }
  }, [isOpen]);

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('prolits-tour-completed', 'true');
    localStorage.setItem('prolits-tour-completed-date', new Date().toISOString());
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('prolits-tour-completed', 'true');
    localStorage.setItem('prolits-tour-skipped', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <DialogTitle>
                {isFirstVisit ? "Welcome Tour" : "Application Guide"}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {tourSteps.length}</span>
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-blue-500' 
                      : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current step content */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <currentTourStep.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
                  {isFirstVisit && currentStep === 0 && (
                    <Badge variant="secondary" className="mt-1">
                      First Time Setup
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {currentTourStep.description}
              </p>
              
              {currentTourStep.action && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    💡 Next Action: {currentTourStep.action}
                  </p>
                </div>
              )}

              {/* Special content for specific steps */}
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <Building className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-medium">Manage Properties</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium">Track Tenants</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <p className="text-sm font-medium">Monitor Finances</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <Bot className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-medium">AI Insights</p>
                  </div>
                </div>
              )}

              {currentStep === tourSteps.length - 1 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">🎉 You're Ready to Start!</h4>
                  <p className="text-sm text-green-700">
                    You now know the key features of PropertyFlow. Remember, you can always click the help button or restart this tour anytime.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!isLastStep && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tour
                </Button>
              )}
              
              {isLastStep ? (
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}