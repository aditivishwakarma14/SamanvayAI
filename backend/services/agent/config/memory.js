import { getMessages } from "../utils/getMessages.js";
import redis from "../../../shared/redis/redis.js";

export const getMemory = async (ConversationId) => {
  const key = `messages-${ConversationId}`;

  // Check Redis cache
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  // If not found in Redis, get from database
  const messages = await getMessages(ConversationId);

  // Store in Redis for 24 hours
  await redis.set(
    key,
    JSON.stringify(messages),
    "EX",
    24 * 60 * 60
  );

  return messages;
};

export const addMessage = async (ConversationId, role, content) => {
  // Redis mein sirf latest 20 messages store karenge

  const key = `messages-${ConversationId}`;

  const rawMessages = await redis.get(key);

  // Agar Redis mein messages hain to parse karo,
  // otherwise empty array
  const messages = rawMessages
    ? JSON.parse(rawMessages)
    : [];

  // New message add karo
  messages.push({
    role,
    content,
  });

  // Sirf latest 20 messages rakho
  if (messages.length > 20) {
    messages.shift();
  }

  // Redis mein save karo
  await redis.set(
    key,
    JSON.stringify(messages),
    "EX",
    24 * 60 * 60
  );

  return messages;
};