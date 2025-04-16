import { Button } from "@/components/ui/button";

interface WelcomeCardProps {
  activeStep: number;
  onClose: () => void;
}

export default function WelcomeCard({ activeStep, onClose }: WelcomeCardProps) {
  return (
    <div className="bg-white rounded shadow-card mb-8 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 text-ytgray-400 hover:text-ytgray-500" 
        onClick={onClose}
        aria-label="Đóng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
      
      <div className="p-6">
        <h1 className="text-xl font-medium text-ytdark mb-2">Chào mừng đến với YTCreator</h1>
        <p className="text-ytgray-400 mb-4">Nền tảng hỗ trợ AI giúp bạn tạo và phát triển kênh YouTube thành công một cách tự động. Hãy bắt đầu với một số bước đơn giản.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Step 1 */}
          <div className={`bg-white border rounded p-4 ${activeStep === 1 ? 'step-active' : activeStep > 1 ? 'step-completed' : ''}`}>
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                activeStep === 1 
                  ? 'bg-red-50 text-ytred' 
                  : activeStep > 1 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-gray-100 text-ytgray-400'
              }`}>
                {activeStep > 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="font-medium">1</span>
                )}
              </div>
              <div>
                <h3 className={`font-medium ${
                  activeStep >= 1 ? 'text-ytdark' : 'text-ytgray-400'
                }`}>
                  Định nghĩa kênh của bạn
                </h3>
                <p className="text-sm text-ytgray-400 mt-1">
                  Cho chúng tôi biết về lĩnh vực và đặt tương mục tiêu của kênh.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className={`bg-white border rounded p-4 ${activeStep === 2 ? 'step-active' : activeStep > 2 ? 'step-completed' : ''}`}>
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                activeStep === 2 
                  ? 'bg-red-50 text-ytred' 
                  : activeStep > 2 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-gray-100 text-ytgray-400'
              }`}>
                {activeStep > 2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="font-medium">2</span>
                )}
              </div>
              <div>
                <h3 className={`font-medium ${
                  activeStep >= 2 ? 'text-ytdark' : 'text-ytgray-400'
                }`}>
                  Phân tích xu hướng
                </h3>
                <p className="text-sm text-ytgray-400 mt-1">
                  AI của chúng tôi phân tích các chủ đề xu hướng trong lĩnh vực của bạn.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className={`bg-white border rounded p-4 ${activeStep === 3 ? 'step-active' : activeStep > 3 ? 'step-completed' : ''}`}>
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                activeStep === 3 
                  ? 'bg-red-50 text-ytred' 
                  : activeStep > 3 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-gray-100 text-ytgray-400'
              }`}>
                {activeStep > 3 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="font-medium">3</span>
                )}
              </div>
              <div>
                <h3 className={`font-medium ${
                  activeStep >= 3 ? 'text-ytdark' : 'text-ytgray-400'
                }`}>
                  Tạo nội dung
                </h3>
                <p className="text-sm text-ytgray-400 mt-1">
                  Tự động tạo video dựa trên các chủ đề xu hướng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
