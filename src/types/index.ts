export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user?: User;
}

export interface Memory {
  id: string;
  family_id: string;
  title: string;
  description?: string;
  memory_type: 'photo' | 'video' | 'audio' | 'story';
  file_url?: string;
  thumbnail_url?: string;
  tags: string[];
  date_taken?: string;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
}

export interface MemoryTag {
  id: string;
  name: string;
  color: string;
  family_id: string;
  created_at: string;
}