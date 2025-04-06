// utils/chat.utils.ts
export function generateChatRoomId(user1: string, user2: string): string {
  // Sort IDs alphabetically to ensure consistent room ID regardless of order
  const ids = [user1, user2].sort();
  return `${ids[0]}_${ids[1]}`.replace(/[^a-zA-Z0-9]/g, '');
}
