import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelSetupFormProps {
  userId: number | null;
  isActive: boolean;
  onComplete: (settingsId: number, category: string) => void;
}

const channelSettingsSchema = z.object({
  userId: z.number(),
  channelName: z.string().min(1, "Vui lòng nhập tên kênh"),
  channelCategory: z.string().min(1, "Vui lòng chọn danh mục kênh"),
  channelDescription: z.string().min(20, "Mô tả kênh phải có ít nhất 20 ký tự"),
  contentTypes: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một loại nội dung"),
  targetLanguage: z.string().default("vietnamese"),
  targetAgeGroup: z.string().optional(),
  youtubeChannelLink: z.string().optional(),
});

type FormValues = z.infer<typeof channelSettingsSchema>;

const contentTypeOptions = [
  { id: "educational", label: "Educational & Informative" },
  { id: "entertaining", label: "Entertaining & Humorous" },
  { id: "tutorial", label: "Tutorial & How to" },
  { id: "storytelling", label: "Storytelling & Narrative" },
  { id: "commentary", label: "Commentary & Review" },
  { id: "update", label: "Update & Compilation" },
];

export default function ChannelSetupForm({ userId, isActive, onComplete }: ChannelSetupFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(channelSettingsSchema),
    defaultValues: {
      userId: userId || 1,
      channelName: "",
      channelCategory: "",
      channelDescription: "",
      contentTypes: [],
      targetLanguage: "vietnamese",
      targetAgeGroup: "",
      youtubeChannelLink: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/channel-settings", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Đã lưu thông tin kênh",
        description: "Thông tin kênh của bạn đã được lưu thành công.",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/channel-settings/${userId}`] });
      onComplete(data.id, data.channelCategory);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể lưu thông tin kênh: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  function saveDraft() {
    const currentValues = form.getValues();
    localStorage.setItem("channelSettingsDraft", JSON.stringify(currentValues));
    setIsDraftSaved(true);
    toast({
      title: "Đã lưu nháp",
      description: "Thông tin kênh của bạn đã được lưu dưới dạng nháp.",
    });
  }

  return (
    <div className={`bg-white rounded shadow-card mb-8 ${!isActive ? 'opacity-70' : ''}`}>
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6 flex items-center">
          <span className="w-6 h-6 rounded-full bg-ytred text-white flex items-center justify-center mr-2 text-sm">1</span>
          Bước 1: Định nghĩa kênh
        </h2>
        <p className="text-ytgray-400 mb-6">Cung cấp thông tin về kênh YouTube của bạn để giúp chúng tôi tạo nội dung phù hợp.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Channel Name */}
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-ytgray-500">Tên kênh</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tên kênh của bạn" 
                      {...field} 
                      disabled={!isActive}
                      className="px-3 py-2 border border-ytgray-200 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Channel Category */}
            <FormField
              control={form.control}
              name="channelCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-ytgray-500">Ngành/Chuyên kênh</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!isActive}
                  >
                    <FormControl>
                      <SelectTrigger className="px-3 py-2 border border-ytgray-200 rounded">
                        <SelectValue placeholder="Chọn một danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="education">Giáo dục & Thông tin</SelectItem>
                      <SelectItem value="entertainment">Giải trí & Hài hước</SelectItem>
                      <SelectItem value="gaming">Trò chơi & Gaming</SelectItem>
                      <SelectItem value="lifestyle">Phong cách sống & Vlog</SelectItem>
                      <SelectItem value="technology">Công nghệ & Đánh giá</SelectItem>
                      <SelectItem value="cooking">Nấu ăn & Ẩm thực</SelectItem>
                      <SelectItem value="fitness">Thể dục & Sức khỏe</SelectItem>
                      <SelectItem value="business">Kinh doanh & Tài chính</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Channel Description */}
            <FormField
              control={form.control}
              name="channelDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-ytgray-500">Mô tả & Mục tiêu kênh</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả trong tầm đối tượng kênh, đối tượng thị trường và mục tiêu của bạn..." 
                      className="px-3 py-2 border border-ytgray-200 rounded resize-none h-32"
                      {...field} 
                      disabled={!isActive}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Content Types */}
            <div>
              <FormLabel className="text-sm font-medium text-ytgray-500 block mb-2">Thể loại nội dung</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {contentTypeOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="contentTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                              disabled={!isActive}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              {form.formState.errors.contentTypes && (
                <p className="text-sm font-medium text-red-500 mt-2">
                  {form.formState.errors.contentTypes.message}
                </p>
              )}
            </div>
            
            {/* Language and Age Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-ytgray-500">Đối tượng mục tiêu</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!isActive}
                    >
                      <FormControl>
                        <SelectTrigger className="px-3 py-2 border border-ytgray-200 rounded">
                          <SelectValue placeholder="Chọn ngôn ngữ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                        <SelectItem value="english">Tiếng Anh</SelectItem>
                        <SelectItem value="both">Cả hai ngôn ngữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAgeGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-ytgray-500">Nhóm tuổi chính</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!isActive}
                    >
                      <FormControl>
                        <SelectTrigger className="px-3 py-2 border border-ytgray-200 rounded">
                          <SelectValue placeholder="Chọn nhóm tuổi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="13-17">13-17 tuổi</SelectItem>
                        <SelectItem value="18-24">18-24 tuổi</SelectItem>
                        <SelectItem value="25-34">25-34 tuổi</SelectItem>
                        <SelectItem value="35-44">35-44 tuổi</SelectItem>
                        <SelectItem value="45+">45+ tuổi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* YouTube Channel Link */}
            <FormField
              control={form.control}
              name="youtubeChannelLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-ytgray-500">Kênh đã tồn tại (Tùy chọn)</FormLabel>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-ytgray-200 bg-gray-50 text-ytgray-400 text-sm">
                      https://youtube.com/
                    </span>
                    <FormControl>
                      <Input 
                        placeholder="Nhập URL kênh YouTube của bạn" 
                        {...field} 
                        disabled={!isActive}
                        className="rounded-none rounded-r-md border border-ytgray-200"
                      />
                    </FormControl>
                  </div>
                  <p className="text-xs text-ytgray-400 mt-1">Nhập vào kênh của bạn để tự động hóa liên kết và đăng tải video lên.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Form Actions */}
            <div className="pt-4 bg-white border-t border-ytgray-200 flex justify-between rounded-b">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-ytgray-500 hover:text-ytgray-700 font-medium text-sm"
                onClick={saveDraft}
                disabled={!isActive}
              >
                {isDraftSaved ? "Đã lưu nháp" : "Lưu nháp"}
              </Button>
              <Button 
                type="submit" 
                className="bg-ytred hover:bg-red-700 text-white font-medium py-2 px-6 rounded-sm"
                disabled={!isActive || isPending}
              >
                {isPending ? "Đang xử lý..." : "Phân tích xu hướng"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
