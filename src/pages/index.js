import { ChatbotCard } from "@/components/ChatbotCard";

// This would typically come from an environment variable or API
const chatbots = [
  {
    id: process.env.NEXT_PUBLIC_CHATBOT_ID_1,
    name: "Chat Data AI Assistant",
    imageUrl: "https://www.chat-data.com/logo.png",
    description: "AI assistant for Chat Data",
  },
  {
    id: process.env.NEXT_PUBLIC_CHATBOT_ID_2,
    name: "Medical Chat AI",
    imageUrl: "https://www.chat-data.com/storage/public/image/avatar_654d8b8bc90461189b362f35.png",
    description: "Healthcare and medical information assistant",
  },
  // Add more chatbots as needed
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Chatbots</h1>
          <p className="text-muted-foreground mt-2">
            {chatbots.length}/20 limit
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chatbots.map((chatbot) => (
            <ChatbotCard key={chatbot.id} chatbot={chatbot} />
          ))}
        </div>
      </div>
    </div>
  );
}