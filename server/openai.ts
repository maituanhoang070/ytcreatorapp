import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development"
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Analyze trends for a given category
export async function analyzeTrendsForCategory(category: string): Promise<{
  keywords: string[];
  topics: any[];
}> {
  try {
    const prompt = `
      Hãy phân tích và đề xuất các xu hướng nội dung YouTube (bằng tiếng Việt) đang phổ biến cho danh mục "${category}".
      
      Trả về JSON với định dạng sau:
      {
        "keywords": [danh sách 5-10 từ khóa phổ biến cho danh mục này],
        "topics": [
          {
            "title": "Tiêu đề xu hướng 1",
            "description": "Mô tả ngắn gọn về xu hướng này",
            "score": [điểm số phổ biến từ 1-100]
          },
          ... tương tự cho 5-10 chủ đề khác
        ]
      }
      
      Hãy tạo ra các xu hướng phù hợp để làm video YouTube trong danh mục ${category} cho người Việt Nam. Đảm bảo rằng các đề xuất là thực tế và có thể tạo nội dung thú vị.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      keywords: result.keywords || [],
      topics: result.topics || [],
    };
  } catch (error) {
    console.error("Error analyzing trends:", error);
    // Return default data in case of error
    return {
      keywords: [`${category}_xu_huong`, `${category}_trends`, `${category}_viet_nam`],
      topics: [
        {
          title: `Xu hướng ${category} hot nhất 2024`,
          description: `Tổng hợp xu hướng ${category} được nhiều người quan tâm hiện nay`,
          score: 95
        },
        {
          title: `Top 10 ${category} được yêu thích nhất`,
          description: `Danh sách 10 ${category} được nhiều người Việt Nam yêu thích`,
          score: 87
        },
        {
          title: `Bí quyết thành công trong lĩnh vực ${category}`,
          description: `Chia sẻ các bí quyết để thành công trong lĩnh vực ${category}`,
          score: 82
        }
      ],
    };
  }
}

// Generate video content based on a topic
export async function generateVideoContent(
  topic: string,
  category: string,
  channelDescription: string
): Promise<{
  title: string;
  description: string;
  script: string;
  tags: string[];
}> {
  try {
    const prompt = `
      Hãy tạo nội dung cho một video YouTube (bằng tiếng Việt) về chủ đề: "${topic}" thuộc danh mục "${category}".
      
      Thông tin thêm về kênh YouTube: "${channelDescription}"
      
      Trả về JSON với định dạng sau:
      {
        "title": "Tiêu đề hấp dẫn cho video",
        "description": "Mô tả chi tiết video (300-500 từ) với các từ khóa SEO phù hợp",
        "script": "Kịch bản chi tiết cho video (1000-1500 từ)",
        "tags": [danh sách 10-15 thẻ phù hợp cho video]
      }
      
      Hãy đảm bảo rằng:
      1. Tiêu đề phải thu hút, chứa từ khóa và dưới 100 ký tự
      2. Mô tả phải chứa từ khóa và hashtag phù hợp
      3. Kịch bản phải có lời chào, giới thiệu nội dung, phần chính và lời kết
      4. Thẻ phải có các từ khóa liên quan đến chủ đề và tối ưu SEO
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || `Video về ${topic}`,
      description: result.description || `Video về chủ đề ${topic} thuộc danh mục ${category}`,
      script: result.script || `Kịch bản video về ${topic}`,
      tags: result.tags || [category, topic, "YouTube", "video"],
    };
  } catch (error) {
    console.error("Error generating video content:", error);
    // Return fallback content in case of error
    return {
      title: `Video về ${topic}`,
      description: `Video về chủ đề ${topic} thuộc danh mục ${category}`,
      script: `Xin chào các bạn, hôm nay chúng ta sẽ tìm hiểu về ${topic}.\n\nĐây là một chủ đề rất thú vị thuộc lĩnh vực ${category}.\n\nHãy subscribe kênh để xem thêm nhiều video hữu ích khác nhé!`,
      tags: [category, topic, "YouTube", "video", "content", "viral", "trending"],
    };
  }
}
