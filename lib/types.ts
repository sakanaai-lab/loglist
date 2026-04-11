export interface Message {
  id: number;
  post_id: number;
  role: 'user' | 'ai';
  content: string;
  position: number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  model_name: string;
  created_at: string;
}

export interface PostWithMessages extends Post {
  messages: Message[];
}

export interface CreatePostPayload {
  title: string;
  description: string;
  model_name: string;
  rounds: Array<{
    user: string;
    ai: string;
  }>;
}
