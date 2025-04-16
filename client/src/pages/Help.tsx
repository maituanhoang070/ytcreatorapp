import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Trợ giúp</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu hướng dẫn</CardTitle>
            <CardDescription>Cách sử dụng YTCreator</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-ytblue hover:underline">Hướng dẫn bắt đầu</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Cách tạo video tự động</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Kết nối với YouTube</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Phân tích xu hướng</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Tối ưu hóa nội dung</a>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Video hướng dẫn</CardTitle>
            <CardDescription>Học thông qua video</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-ytblue hover:underline">Tạo kênh YouTube tự động</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Chiến lược tạo nội dung</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Tối ưu hóa SEO YouTube</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Lên lịch đăng tải video</a>
              </li>
              <li>
                <a href="#" className="text-ytblue hover:underline">Phân tích hiệu suất kênh</a>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ hỗ trợ</CardTitle>
            <CardDescription>Cần trợ giúp thêm?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
            <a 
              href="mailto:support@ytcreator.com" 
              className="inline-block bg-ytred hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Gửi email hỗ trợ
            </a>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Câu hỏi thường gặp</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>YTCreator hoạt động như thế nào?</AccordionTrigger>
              <AccordionContent>
                YTCreator sử dụng trí tuệ nhân tạo để tự động tạo và đăng tải nội dung video lên kênh YouTube của bạn. 
                Hệ thống phân tích xu hướng, tạo nội dung phù hợp, và đăng tải video một cách tự động, giúp bạn 
                tiết kiệm thời gian và tối ưu hóa hiệu suất kênh YouTube.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Tôi có thể tạo video bằng ngôn ngữ nào?</AccordionTrigger>
              <AccordionContent>
                Hiện tại, YTCreator hỗ trợ tạo nội dung bằng tiếng Việt là chính. Chúng tôi đang phát triển 
                thêm các tùy chọn ngôn ngữ khác và sẽ cập nhật trong thời gian tới.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Làm thế nào để kết nối kênh YouTube của tôi?</AccordionTrigger>
              <AccordionContent>
                Bạn có thể kết nối kênh YouTube bằng cách nhấp vào nút "Kết nối YouTube" ở góc trên bên phải 
                màn hình. Sau đó, đăng nhập vào tài khoản Google của bạn và cấp quyền cho YTCreator để quản lý 
                kênh YouTube của bạn.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>YTCreator có tự động đăng tải video không?</AccordionTrigger>
              <AccordionContent>
                Có, YTCreator có thể tự động đăng tải video lên kênh YouTube của bạn. Bạn cũng có thể 
                lên lịch đăng tải để tối ưu hóa thời gian đăng tải cho từng video.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>YTCreator có miễn phí không?</AccordionTrigger>
              <AccordionContent>
                YTCreator cung cấp gói dùng thử miễn phí với các tính năng giới hạn. Để truy cập đầy đủ 
                các tính năng và không giới hạn số lượng video, bạn cần nâng cấp lên gói Premium.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Tôi có thể chỉnh sửa video trước khi đăng tải không?</AccordionTrigger>
              <AccordionContent>
                Có, bạn có thể xem trước và chỉnh sửa mọi khía cạnh của video trước khi đăng tải, 
                bao gồm tiêu đề, mô tả, thẻ, và nội dung video.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
