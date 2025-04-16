import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Video } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const userId = 1; // This would come from authentication in a real app
  const { toast } = useToast();

  const { data: videos, isLoading } = useQuery({
    queryKey: [`/api/videos/${userId}`],
    enabled: !!userId,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tổng video</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? "..." : videos?.length || 0}</p>
            <p className="text-sm text-ytgray-400">Video đã tạo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Đã đăng tải</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? "..." : videos?.filter((v: Video) => v.status === "published").length || 0}
            </p>
            <p className="text-sm text-ytgray-400">Video đã đăng trên YouTube</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? "..." : videos?.filter((v: Video) => v.status === "processing").length || 0}
            </p>
            <p className="text-sm text-ytgray-400">Video đang được tạo</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Video của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="published">Đã đăng tải</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="draft">Bản nháp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : videos?.length > 0 ? (
                <div className="space-y-4">
                  {videos.map((video: Video) => (
                    <VideoItem key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Bạn chưa có video nào. Hãy tạo video đầu tiên!
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="published">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : videos?.filter((v: Video) => v.status === "published").length > 0 ? (
                <div className="space-y-4">
                  {videos
                    .filter((v: Video) => v.status === "published")
                    .map((video: Video) => (
                      <VideoItem key={video.id} video={video} />
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Bạn chưa có video nào đã đăng tải.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="processing">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : videos?.filter((v: Video) => v.status === "processing").length > 0 ? (
                <div className="space-y-4">
                  {videos
                    .filter((v: Video) => v.status === "processing")
                    .map((video: Video) => (
                      <VideoItem key={video.id} video={video} />
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Không có video nào đang xử lý.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="draft">
              {isLoading ? (
                <p>Đang tải...</p>
              ) : videos?.filter((v: Video) => v.status === "draft").length > 0 ? (
                <div className="space-y-4">
                  {videos
                    .filter((v: Video) => v.status === "draft")
                    .map((video: Video) => (
                      <VideoItem key={video.id} video={video} />
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Bạn không có bản nháp nào.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function VideoItem({ video }: { video: Video }) {
  const { toast } = useToast();
  
  const handleViewClick = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng xem chi tiết video sẽ sớm ra mắt!",
    });
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã đăng tải</span>;
      case "processing":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Đang xử lý</span>;
      case "draft":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Bản nháp</span>;
      case "failed":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Lỗi</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };
  
  return (
    <div className="border rounded-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-medium">{video.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {getStatusLabel(video.status)}
          <span className="text-sm text-ytgray-400">
            {video.createdAt ? new Date(video.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-auto">
        <Button variant="outline" size="sm" onClick={handleViewClick}>
          Xem
        </Button>
        {video.youtubeVideoId && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://youtube.com/watch?v=${video.youtubeVideoId}`, '_blank')}
          >
            YouTube
          </Button>
        )}
      </div>
    </div>
  );
}
