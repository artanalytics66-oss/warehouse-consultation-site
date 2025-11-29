import { MessageCircle, Send } from 'lucide-react';

const ContactButtons = () => {
  const phoneNumber = '79126734195';
  const telegramUsername = 'LMikhail67';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Здравствуйте!%20Хочу%20получить%20консультацию`;
  const telegramUrl = `https://t.me/${telegramUsername}`;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#0088cc] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 hover:shadow-xl"
        aria-label="Написать в Telegram"
      >
        <Send className="w-6 h-6" />
      </a>
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 hover:shadow-xl"
        aria-label="Написать в WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default ContactButtons;