import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({

  prompt : Annotation() ,
  aiResponse : Annotation() ,
  agent : Annotation() , // isme hum yeh check karnege ki kon sa agent use karna hai 
  conversationId : Annotation()
});

