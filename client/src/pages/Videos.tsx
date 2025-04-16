import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Videos() {
  const userId = 1; // This would come from authentication in a real app
  const { toast } = useToast();

  const { data: videos, isLoading } = useQuery({
    queryKey: [`/api/videos/${userId}`],
    enabled: !!userId,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video của tôi</h1>
        <Link href="/">
          <Button className="bg-ytred hover:bg-red-700">
            Tạo Video Mới
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tất cả video</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="published">Đã đăng tải</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="scheduled">Đã lên lịch</TabsTrigger>
              <TabsTrigger value="draft">Bản nháp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Đang tải...</p>
                </div>
              ) : videos?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videos.map((video: Video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-ytgray-400 mb-4">Bạn chưa có video nào</p>
                  <Link href="/">
                    <Button className="bg-ytred hover:bg-red-700">
                      Tạo Video Đầu Tiên
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="published">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Đang tải...</p>
                </div>
              ) : videos?.filter((v: Video) => v.status === "published").length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videos
                    .filter((v: Video) => v.status === "published")
                    .map((video: Video) => (
                      <VideoCard key={video.id} video={video} />
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
                <div className="flex justify-center py-8">
                  <p>Đang tải...</p>
                </div>
              ) : videos?.filter((v: Video) => v.status === "processing").length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videos
                    .filter((v: Video) => v.status === "processing")
                    .map((video: Video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Không có video nào đang xử lý.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="scheduled">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Đang tải...</p>
                </div>
              ) : videos?.filter((v: Video) => v.scheduledFor !== null).length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videos
                    .filter((v: Video) => v.scheduledFor !== null)
                    .map((video: Video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-ytgray-400">
                  Bạn chưa có video nào đã lên lịch.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="draft">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Đang tải...</p>
                </div>
              ) : videos?.filter((v: Video) => v.status === "draft").length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videos
                    .filter((v: Video) => v.status === "draft")
                    .map((video: Video) => (
                      <VideoCard key={video.id} video={video} />
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

function VideoCard({ video }: { video: Video }) {
  const { toast } = useToast();
  
  const handleViewClick = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng xem chi tiết video sẽ sớm ra mắt!",
    });
  };
  
  const handleEditClick = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng chỉnh sửa video sẽ sớm ra mắt!",
    });
  };
  
  const getStatusBadge = (status: string) => {
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
    <div className="border rounded-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48 h-28 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          {video.thumbnailUrl ? (
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-lg">{video.title}</h3>
          <p className="text-sm text-ytgray-400 mt-1 line-clamp-2">
            {video.description ? video.description.substring(0, 100) + '...' : 'Không có mô tả'}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {getStatusBadge(video.status)}
            <span className="text-xs text-ytgray-400">
              {video.createdAt ? new Date(video.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </span>
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {video.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-xs text-ytgray-500 bg-ytgray-100 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
                {video.tags.length > 3 && (
                  <span className="text-xs text-ytgray-400">+{video.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 self-end md:self-center">
          <Button variant="outline" size="sm" onClick={handleViewClick}>
            Xem
          </Button>
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            Chỉnh sửa
          </Button>
          {video.youtubeVideoId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://youtube.com/watch?v=${video.youtubeVideoId}`, '_blank')}
            >
              Mở trên YouTube
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
