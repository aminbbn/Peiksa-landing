
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface PricingPlan {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export enum PageRoute {
  HOME = '/',
  FEATURES = '/features',
  PRICING = '/pricing',
  CONTACT = '/contact',
  AUTH = '/auth',
  ABOUT = '/about',
  CAREERS = '/careers',
  CUSTOMERS = '/customers',
  SUPPORT = '/support',
  STATUS = '/status',
  SECURITY = '/security',
  // Dashboard Routes
  DASHBOARD = '/dashboard',
  DASHBOARD_CRM = '/dashboard/crm',
  DASHBOARD_CAMPAIGNS = '/dashboard/campaigns',
  DASHBOARD_ANALYTICS = '/dashboard/analytics',
  DASHBOARD_SETTINGS = '/dashboard/settings',
  DASHBOARD_EMAIL_BUILDER = '/dashboard/email-builder',
  DASHBOARD_FILES = '/dashboard/files',
}

// Dashboard Types
export interface Customer {
  id: string;
  firstName: string; // 1
  lastName: string; // 2
  phone: string; // 3
  email: string; // 4
  isEmailable: boolean; // 5
  
  // Communication Stats
  lastEmailDate?: string; // 6
  lastEmailSubject?: string; // 7
  lastSmsDate?: string; // 8
  lastSmsSubject?: string; // 9
  
  // Demographics
  language: string; // 10
  gender: 'Male' | 'Female' | 'Other'; // 11
  nationality: string; // 12
  
  // Address
  address1?: string; // 13
  address2?: string; // 14
  workAddress?: string; // 15
  
  // Segmentation
  tags: string[]; // 16
  interestScore: number; // 17
  
  // System
  group: string;
  status: 'active' | 'inactive' | 'lead';
  avatar?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  date: string;
}
