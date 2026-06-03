export interface ChatMessage {
  id: string;
  sender: "renter" | "agency";
  text: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  agency_id: string;
  agency_name: string;
  bike_id: string;
  bike_name: string;
  messages: ChatMessage[];
  last_message_at: string;
}

const KEY = "rnr_messages";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function save(convos: Conversation[]): void {
  localStorage.setItem(KEY, JSON.stringify(convos));
}

export function getOrCreateConversation(
  agencyId: string,
  agencyName: string,
  bikeId: string,
  bikeName: string
): Conversation {
  const convos = getConversations();
  const id = `${agencyId}-${bikeId}`;
  const existing = convos.find((c) => c.id === id);
  if (existing) return existing;

  const convo: Conversation = {
    id,
    agency_id: agencyId,
    agency_name: agencyName,
    bike_id: bikeId,
    bike_name: bikeName,
    messages: [],
    last_message_at: new Date().toISOString(),
  };
  save([convo, ...convos]);
  return convo;
}

export function sendMessage(
  conversationId: string,
  sender: "renter" | "agency",
  text: string
): Conversation | null {
  const convos = getConversations();
  const idx = convos.findIndex((c) => c.id === conversationId);
  if (idx === -1) return null;

  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender,
    text,
    created_at: new Date().toISOString(),
  };

  const updated = { ...convos[idx], messages: [...convos[idx].messages, msg], last_message_at: msg.created_at };
  const newConvos = [...convos];
  newConvos[idx] = updated;
  save(newConvos);
  return updated;
}
