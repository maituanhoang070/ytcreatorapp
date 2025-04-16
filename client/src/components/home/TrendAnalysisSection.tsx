import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TrendAnalysisSectionProps {
  userId: number | null;
  channelSettingsId: number | null;
  category: string;
  isActive: boolean;
  onComplete: () => void;
}

interface TrendTopic {
  title: string;
  description: string;
  score: number;
}

export default function TrendAnalysisSection({
  userId,
  channelSettingsId,
  category,
  isActive,
  onComplete
}: TrendAnalysisSectionProps) {
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Reset the selected topic when category changes
  useEffect(() => {
    setSelectedTopic(null);
  }, [category]);

  const { data: trends, isLoading, error } = useQuery({
    queryKey: [`/api/trends/${category}`],
    enabled: isActive && !!category,
  });

  const handleTopicSelect = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
  };

  const handleContinue = () => {
    if (!selectedTopic) {
      toast({
        title: "Chọn chủ đề",
        description: "Vui lòng chọn một chủ đề xu hướng để tiếp tục.",
        variant: "destructive",
      });
      return;
    }

    onComplete();
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded shadow-card mb-8 opacity-70">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-6 flex items-center">
            <span className="w-6 h-6 rounded-full bg-ytgray-300 text-white flex items-center justify-center mr-2 text-sm">2</span>
            Bước 2: Phân tích xu hướng
          </h2>
          <p className="text-ytgray-400 mb-6">AI của chúng tôi sẽ phân tích xu hướng và đề xuất chủ đề nội dung phù hợp.</p>
          
          <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-ytgray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-ytgray-400 text-center">Kết thúc bước 1 để xem phân tích xu hướng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-card mb-8">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6 flex items-center">
          <span className="w-6 h-6 rounded-full bg-ytred text-white flex items-center justify-center mr-2 text-sm">2</span>
          Bước 2: Phân tích xu hướng
        </h2>
        <p className="text-ytgray-400 mb-6">AI của chúng tôi phân tích xu hướng và đề xuất chủ đề nội dung phù hợp cho kênh của bạn.</p>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded text-red-600">
            <p className="font-medium">Đã xảy ra lỗi khi phân tích xu hướng</p>
            <p className="text-sm mt-1">Vui lòng thử lại sau hoặc chọn một danh mục khác.</p>
          </div>
        ) : trends && trends.length > 0 ? (
          <div className="space-y-6">
            {/* Keywords */}
            <div>
              <h3 className="text-base font-medium mb-3">Từ khóa phổ biến trong danh mục {getCategoryLabel(category)}</h3>
              <div className="flex flex-wrap gap-2">
                {trends[0].keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-ytgray-100 text-ytgray-500">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Trending Topics Chart */}
            <div>
              <h3 className="text-base font-medium mb-3">Điểm xu hướng các chủ đề hàng đầu</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trends[0].topics.slice(0, 5).map((topic: TrendTopic) => ({
                      name: truncateText(topic.title, 25),
                      score: topic.score
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`Điểm xu hướng: ${value}`, 'Điểm số']}
                      labelFormatter={(value) => `Chủ đề: ${value}`}
                    />
                    <Bar dataKey="score" background={{ fill: '#f5f5f5' }}>
                      {trends[0].topics.slice(0, 5).map((topic: TrendTopic, index: number) => (
                        <Cell key={`cell-${index}`} fill="#FF0000" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Topic Selection */}
            <div>
              <h3 className="text-base font-medium mb-3">Chọn chủ đề cho video của bạn</h3>
              <div className="grid grid-cols-1 gap-3">
                {trends[0].topics.map((topic: TrendTopic, index: number) => (
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
                        <Badge className="bg-ytred">{topic.score}%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-4 bg-white border-t border-ytgray-200 flex justify-end rounded-b">
              <Button 
                className="bg-ytred hover:bg-red-700 text-white font-medium py-2 px-6 rounded-sm"
                onClick={handleContinue}
              >
                Tạo nội dung
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-ytgray-100 p-8 rounded flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-ytgray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-ytgray-400 text-center">Không tìm thấy dữ liệu xu hướng cho danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getCategoryLabel(category: string): string {
  const categoryMap: {[key: string]: string} = {
    'education': 'Giáo dục & Thông tin',
    'entertainment': 'Giải trí & Hài hước',
    'gaming': 'Trò chơi & Gaming',
    'lifestyle': 'Phong cách sống & Vlog',
    'technology': 'Công nghệ & Đánh giá',
    'cooking': 'Nấu ăn & Ẩm thực',
    'fitness': 'Thể dục & Sức khỏe',
    'business': 'Kinh doanh & Tài chính',
  };
  
  return categoryMap[category] || category;
}
