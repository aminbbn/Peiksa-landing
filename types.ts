
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
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'lead';
  spent: number;
  lastSeen: string;
  tags: string[];
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
