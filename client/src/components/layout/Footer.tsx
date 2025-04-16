import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-ytdark text-ytgray-300 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-ytred" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
              <span className="font-medium text-lg text-white ml-1">YTCreator</span>
            </div>
            <p className="text-xs mt-2">© 2024 YTCreator. Tất cả các quyền được bảo lưu.</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-ytgray-300 hover:text-white text-sm">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-ytgray-300 hover:text-white text-sm">
              Điều khoản dịch vụ
            </Link>
            <Link href="/help" className="text-ytgray-300 hover:text-white text-sm">
              Trợ giúp
            </Link>
            <Link href="/contact" className="text-ytgray-300 hover:text-white text-sm">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
