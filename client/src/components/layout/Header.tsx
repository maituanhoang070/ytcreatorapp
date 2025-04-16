import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [showMobileNav, setShowMobileNav] = useState(false);

  // In a real app, this would come from an auth context
  const isAuthenticated = true;
  
  const { data: youtubeAuthUrl } = useQuery({
    queryKey: ["/api/youtube/auth-url"],
    enabled: isAuthenticated,
  });

  const handleYouTubeConnect = () => {
    if (youtubeAuthUrl?.authUrl) {
      window.open(youtubeAuthUrl.authUrl, "_blank", "width=600,height=700");
    } else {
      toast({
        title: "Không thể kết nối YouTube",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <svg className="w-6 h-6 text-ytred" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
            <span className="font-medium text-lg text-ytdark ml-1">YTCreator</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className={`text-sm py-2 border-b-2 ${location === "/" ? "border-ytred text-ytdark font-medium" : "border-transparent text-ytgray-400 hover:text-ytdark"}`}>
              Trang chủ
            </Link>
            <Link href="/dashboard" className={`text-sm py-2 border-b-2 ${location === "/dashboard" ? "border-ytred text-ytdark font-medium" : "border-transparent text-ytgray-400 hover:text-ytdark"}`}>
              Bảng điều khiển
            </Link>
            <Link href="/videos" className={`text-sm py-2 border-b-2 ${location === "/videos" ? "border-ytred text-ytdark font-medium" : "border-transparent text-ytgray-400 hover:text-ytdark"}`}>
              Video của tôi
            </Link>
            <Link href="/analytics" className={`text-sm py-2 border-b-2 ${location === "/analytics" ? "border-ytred text-ytdark font-medium" : "border-transparent text-ytgray-400 hover:text-ytdark"}`}>
              Phân tích
            </Link>
            <Link href="/help" className={`text-sm py-2 border-b-2 ${location === "/help" ? "border-ytred text-ytdark font-medium" : "border-transparent text-ytgray-400 hover:text-ytdark"}`}>
              Trợ giúp
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-ytgray-500 text-sm rounded-full px-3 py-1 flex items-center"
            onClick={handleYouTubeConnect}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Kết nối YouTube
          </Button>
          
          <Link href="/">
            <Button className="bg-ytred hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-sm">
              Tạo Video
            </Button>
          </Link>
          
          <div className="w-8 h-8 rounded-full bg-ytgray-300 text-white flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
              U
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-ytgray-500"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {showMobileNav && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-2">
            <Link href="/" className={`py-2 ${location === "/" ? "text-ytdark font-medium" : "text-ytgray-400"}`}>
              Trang chủ
            </Link>
            <Link href="/dashboard" className={`py-2 ${location === "/dashboard" ? "text-ytdark font-medium" : "text-ytgray-400"}`}>
              Bảng điều khiển
            </Link>
            <Link href="/videos" className={`py-2 ${location === "/videos" ? "text-ytdark font-medium" : "text-ytgray-400"}`}>
              Video của tôi
            </Link>
            <Link href="/analytics" className={`py-2 ${location === "/analytics" ? "text-ytdark font-medium" : "text-ytgray-400"}`}>
              Phân tích
            </Link>
            <Link href="/help" className={`py-2 ${location === "/help" ? "text-ytdark font-medium" : "text-ytgray-400"}`}>
              Trợ giúp
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
