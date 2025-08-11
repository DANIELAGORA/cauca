export type UserRole = 
  | 'comite-ejecutivo-nacional'
  | 'lider-regional'
  | 'comite-departamental'
  | 'candidato'
  | 'influenciador'
  | 'lider'
  | 'votante';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  region?: string;
  department?: string;
  permissions?: string[];
  lastActivity?: Date;
  joinedAt?: Date;
  lastActive?: Date;
  isActive?: boolean;
  isRealUser?: boolean;
  canCreateRoles?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: UserRole;
  recipientId?: string;
  recipientRole?: UserRole;
  content: string;
  type: 'direct' | 'broadcast' | 'hierarchical';
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  territory?: string;
  topic?: string;
  readBy: string[];
}

export interface Campaign {
  id: string;
  candidateId: string;
  name: string;
  territory: string;
  platform: 'meta' | 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'whatsapp';
  budget: number;
  targetAudience: {
    ageRange: string;
    interests: string[];
    location: string[];
  };
  content: {
    type: 'video' | 'image' | 'text' | 'carousel';
    assets: string[];
    caption: string;
    hashtags: string[];
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    frequency: 'daily' | 'weekly' | 'custom';
    times: string[];
  };
  status: 'active' | 'paused' | 'completed';
  metrics: {
    reach: number;
    engagement: number;
    sentiment: number;
    influence: number;
    clicks: number;
    conversions: number;
    cost: number;
    roi: number;
  };
  startDate: Date;
  endDate?: Date;
}

export interface DatabaseEntry {
  id: string;
  type: 'excel' | 'image' | 'document';
  name: string;
  uploadedBy: string;
  uploadDate: Date;
  territory?: string;
  category: string;
  data?: any;
  metadata: Record<string, any>;
}

export interface CampaignFinanceEntry {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  amount: number;
  transaction_date: Date;
  document_url?: string;
  created_at: Date;
}

export interface Analytics {
  participation: { date: string; value: number }[];
  sentiment: { date: string; positive: number; negative: number; neutral: number }[];
  influence: { platform: string; value: number }[];
  territory: { name: string; activity: number }[];
  campaigns: {
    platform: string;
    reach: number;
    engagement: number;
    cost: number;
    roi: number;
  }[];
  socialMedia: {
    platform: string;
    followers: number;
    growth: number;
    engagement: number;
  }[];
}