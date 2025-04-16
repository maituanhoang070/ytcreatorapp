import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Clock, Youtube } from "lucide-react";
import { vi } from 'date-fns/locale';

interface ContentGenerationSectionProps {
  userId: number | null;
  category: string;
  isActive: boolean;
}

export default function ContentGenerationSection({
  userId,
  category,
  isActive
}: ContentGenerationSectionProps) {
  const { toast } = useToast();
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showSchedulingOptions, setShowSchedulingOptions] = useState(false);
  
  // Get trend data for the category
  const { data: trendData, isLoading: isTrendsLoading } = useQuery({
    queryKey: [`/api/trends/${category}`],
    enabled: isActive && !!category,
  });

  // Handle video generation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { userId: number; topicId: string; category: string }) => {
      setGeneratingVideo(true);
      
      // Simulate progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 10;
        if (currentProgress > 100) {
          currentProgress = 100;
          clearInterval(interval);
        }
        setProgress(Math.floor(currentProgress));
      }, 1000);
      
      const response = await apiRequest("POST", "/api/videos/generate", data);
      
      // Ensure we show complete progress
      clearInterval(interval);
      setProgress(100);
      
      // Wait a bit to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Video đang được tạo",
        description: `Video "${data.title}" đã được đưa vào hàng đợi xử lý.`,
      });
      
      // Reset after successful generation
      setTimeout(() => {
        setGeneratingVideo(false);
        setProgress(0);
        setSelectedTopic(null);
      }, 2000);
    },
    onError: (error) => {
      setGeneratingVideo(false);
      setProgress(0);
      
      toast({
        title: "Lỗi",
        description: `Không thể tạo video: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleTopicSelect = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
  };

  const handleGenerateVideo = () => {
    if (!userId || !selectedTopic || !category) {
      toast({
        title: "Không thể tạo video",
        description: "Vui lòng chọn một chủ đề để tạo video.",
        variant: "destructive",
      });
      return;
    }

    mutate({
      userId,
      topicId: selectedTopic,
      category,
    });
  };

  const handleSchedule = () => {
    if (!selectedDate) {
      toast({
        title: "Chọn ngày",
        description: "Vui lòng chọn ngày để lên lịch đăng tải video.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đã lên lịch",
      description: `Video sẽ được tạo và đăng tải vào ngày ${format(selectedDate, 'dd/MM/yyyy', { locale: vi })}.`,
    });
    
    setShowSchedulingOptions(false);
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded shadow-card opacity-70">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-6 flex items-center">
            <span className="w-6 h-6 rounded-full bg-ytgray-300 text-white flex items-center justify-center mr-2 text-sm">3</span>
            Bước 3: Tạo nội dung
          </h2>
          <p className="text-ytgray-400 mb-6">Hệ thống sẽ tự động tạo và đăng tải video dựa trên xu hướng phân tích.</p>
          
          <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-ytgray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-ytgray-400 text-center">Hoàn thành bước 2 để bắt đầu tạo nội dung.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-card">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6 flex items-center">
          <span className="w-6 h-6 rounded-full bg-ytred text-white flex items-center justify-center mr-2 text-sm">3</span>
          Bước 3: Tạo nội dung
        </h2>
        <p className="text-ytgray-400 mb-6">Hệ thống sẽ tự động tạo và đăng tải video dựa trên xu hướng đã phân tích.</p>
        
        {generatingVideo ? (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-medium mb-2">Đang tạo video...</h3>
              <p className="text-ytgray-400 mb-6">Quá trình này có thể mất vài phút. Vui lòng đợi.</p>
              
              <div className="max-w-md mx-auto space-y-4">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-sm text-ytgray-500">{progress}% hoàn thành</p>
                
                <div className="bg-ytgray-100 p-6 rounded mt-4">
                  <div className="flex flex-col items-center space-y-2">
                    {progress < 30 && (
                      <>
                        <Badge className="bg-blue-500 mb-2">Phân tích chủ đề</Badge>
                        <p className="text-sm text-ytgray-400">Đang phân tích chủ đề và tạo kịch bản...</p>
                      </>
                    )}
                    
                    {progress >= 30 && progress < 60 && (
                      <>
                        <Badge className="bg-purple-500 mb-2">Tạo kịch bản</Badge>
                        <p className="text-sm text-ytgray-400">Đang tạo kịch bản và biên tập nội dung...</p>
                      </>
                    )}
                    
                    {progress >= 60 && progress < 90 && (
                      <>
                        <Badge className="bg-orange-500 mb-2">Tạo video</Badge>
                        <p className="text-sm text-ytgray-400">Đang tạo video, thêm hiệu ứng và âm thanh...</p>
                      </>
                    )}
                    
                    {progress >= 90 && (
                      <>
                        <Badge className="bg-green-500 mb-2">Hoàn thiện</Badge>
                        <p className="text-sm text-ytgray-400">Đang hoàn thiện và chuẩn bị đăng tải...</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="trending">
              <TabsList className="mb-4">
                <TabsTrigger value="trending">Xu hướng</TabsTrigger>
                <TabsTrigger value="recommended">Được đề xuất</TabsTrigger>
                <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending">
                {isTrendsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : trendData && trendData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {trendData[0].topics.map((topic: any, index: number) => (
                      <Card 
                        key={index} 
                        className={`border cursor-pointer transition-all ${selectedTopic === topic.title ? 'border-ytred bg-red-50' : 'hover:border-gray-300'}`}
                        onClick={() => handleTopicSelect(topic.title)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{topic.title}</h4>
                              <p className="text-sm text-ytgray-400 mt-1">{topic.description || 'Không có mô tả'}</p>
                            </div>
                            <div className="flex items-center">
                              <Badge className="bg-ytred mr-2">{topic.score}%</Badge>
                              {selectedTopic === topic.title && (
                                <Check className="h-5 w-5 text-ytred" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
                    <p className="text-ytgray-400 text-center">Không có dữ liệu xu hướng cho danh mục này.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recommended">
                <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
                  <p className="text-ytgray-400 text-center">Tính năng đề xuất nội dung dựa trên kênh của bạn sẽ sớm ra mắt!</p>
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
                  <p className="text-ytgray-400 text-center">Tính năng tạo nội dung tùy chỉnh sẽ sớm ra mắt!</p>
                </div>
              </TabsContent>
            </Tabs>
            
            {showSchedulingOptions ? (
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="text-base font-medium mb-3">Lên lịch đăng tải</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <p className="text-sm text-ytgray-500 mb-2">Chọn ngày đăng tải:</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, 'PPP', { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={vi}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grow">
                    <p className="text-sm text-ytgray-500 mb-2">Thời gian tối ưu:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="cursor-pointer bg-white text-ytgray-500 hover:bg-gray-200" onClick={() => {}}>
                        <Clock className="h-3 w-3 mr-1" /> 08:00 sáng
                      </Badge>
                      <Badge className="cursor-pointer bg-white text-ytgray-500 hover:bg-gray-200" onClick={() => {}}>
                        <Clock className="h-3 w-3 mr-1" /> 12:00 trưa
                      </Badge>
                      <Badge className="cursor-pointer bg-ytred hover:bg-red-700" onClick={() => {}}>
                        <Clock className="h-3 w-3 mr-1" /> 19:30 tối
                      </Badge>
                      <Badge className="cursor-pointer bg-white text-ytgray-500 hover:bg-gray-200" onClick={() => {}}>
                        <Clock className="h-3 w-3 mr-1" /> 21:00 tối
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between">
                  <Button 
                    variant="ghost" 
                    className="text-ytgray-500"
                    onClick={() => setShowSchedulingOptions(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    className="bg-ytred hover:bg-red-700 text-white" 
                    onClick={handleSchedule}
                  >
                    Lên lịch
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 bg-white border-t border-ytgray-200 flex justify-between rounded-b">
                <Button 
                  variant="outline" 
                  className="text-ytgray-500"
                  onClick={() => setShowSchedulingOptions(true)}
                  disabled={!selectedTopic || isPending}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Lên lịch
                </Button>
                <Button 
                  className="bg-ytred hover:bg-red-700 text-white" 
                  onClick={handleGenerateVideo}
                  disabled={!selectedTopic || isPending}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  {isPending ? "Đang xử lý..." : "Tạo video ngay"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
