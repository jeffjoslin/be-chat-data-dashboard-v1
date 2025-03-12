import { Card, CardContent, CardHeader } from "@/components/card";
import { useRouter } from "next/router";
import { useState } from "react";

const mockUser = {
    name: 'Test name',
    email: 'user@gmail.com',
    avatar: 'https://www.chat-data.com/storage/public/image/avatar_654d8b8bc90461189b362f35.png',
}

export function ChatbotCard({ chatbot }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleClick = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);

      const response = await fetch('/api/get-sso-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            chatbotId: chatbot.id,
            name: mockUser.name,
            email: mockUser.email,
            avatar: mockUser.avatar,
        }),
      });

      const { ssoToken } = await response.json();

      
      router.push('https://chatbot.chat-data.online/api/v1/auth/sso?companyid=' +
            process.env.NEXT_PUBLIC_COMPANY_ID +
            '&ssoToken=' +
            ssoToken +
            '&redirect=' +
            process.env.NEXT_PUBLIC_REDIRECT_URL)
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className={`
        w-[300px] h-[400px] 
        flex flex-col 
        cursor-pointer 
        transition-all duration-200 
        hover:shadow-lg hover:scale-105
        ${isLoading ? 'opacity-70 pointer-events-none' : ''}
      `}
      onClick={handleClick}
    >
      <CardHeader className="flex-none text-center">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
          <img
            src={chatbot.imageUrl}
            alt={chatbot.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="text-xl font-semibold text-center mb-2">{chatbot.name}</h3>
        <p className="text-sm text-muted-foreground text-center">
          {chatbot.description}
        </p>
      </CardContent>
    </Card>
  );
}