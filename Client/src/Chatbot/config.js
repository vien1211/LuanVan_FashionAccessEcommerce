import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./Components/BotAvatar";
import UserAvatar from "./Components/UserAvatar";
import StartWidget from "./Components/StartWidget";
import ChatOptions from "./Components/ChatOptions";

const botName = "VieVie";

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}! How can I assist you today? This is some our categories products, take a look!`, {
    widget: "StartWidget",
  })],
  botName: botName,
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
  },
  widgets: [
    {
        widgetName: "StartWidget",
        widgetFunc: (props) => <StartWidget {...props} />
    },
   
],
};

export default config;
