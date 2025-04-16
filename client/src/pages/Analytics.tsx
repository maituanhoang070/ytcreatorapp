import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>("week");
  
  // Sample data (would come from API in real implementation)
  const viewData = [
    { date: '01/05', views: 342 },
    { date: '02/05', views: 528 },
    { date: '03/05', views: 401 },
    { date: '04/05', views: 612 },
    { date: '05/05', views: 487 },
    { date: '06/05', views: 579 },
    { date: '07/05', views: 698 },
  ];
  
  const categoryData = [
    { name: 'Công nghệ', value: 35 },
    { name: 'Giải trí', value: 25 },
    { name: 'Giáo dục', value: 20 },
    { name: 'Phong cách sống', value: 15 },
    { name: 'Khác', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  
  const topVideos = [
    { id: 1, title: "Top 10 xu hướng công nghệ 2024", views: 23542, likes: 1234 },
    { id: 2, title: "Hướng dẫn tạo video viral trên YouTube", views: 18972, likes: 987 },
    { id: 3, title: "Bí quyết kiếm tiền từ YouTube", views: 15483, likes: 856 },
    { id: 4, title: "Phân tích xu hướng thị trường", views: 12365, likes: 723 },
    { id: 5, title: "Cách tăng người đăng ký kênh", views: 9824, likes: 618 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Phân tích</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="videos">Phân tích video</TabsTrigger>
            <TabsTrigger value="audience">Người xem</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mb-4 mt-4">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">24 giờ qua</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="year">12 tháng qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Lượt xem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">45,892</p>
                  <p className="text-sm text-green-600">+12.5% so với tuần trước</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Thời gian xem (giờ)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">1,892</p>
                  <p className="text-sm text-green-600">+8.2% so với tuần trước</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Người đăng ký mới</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">347</p>
                  <p className="text-sm text-green-600">+15.7% so với tuần trước</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lượt xem theo ngày</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={viewData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#FF0000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Video có hiệu suất tốt nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Tiêu đề</th>
                        <th className="text-right py-2 font-medium">Lượt xem</th>
                        <th className="text-right py-2 font-medium">Lượt thích</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topVideos.map((video) => (
                        <tr key={video.id} className="border-b">
                          <td className="py-3">{video.title}</td>
                          <td className="text-right py-3">{video.views.toLocaleString()}</td>
                          <td className="text-right py-3">{video.likes.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="py-12 text-center">
              <p className="text-ytgray-400">Đang phát triển tính năng phân tích chi tiết theo video...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="py-12 text-center">
              <p className="text-ytgray-400">Đang phát triển tính năng phân tích chi tiết người xem...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
