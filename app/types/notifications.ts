// Notification Types and Interfaces

export type NotificationType =
  | 'price_change'
  | 'new_model'
  | 'deprecation'
  | 'model_update'
  | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  modelId?: string;
  modelName?: string;
  provider?: string;
  timestamp: string;
  read: boolean;
  changes?: ModelChange[];
  actionUrl?: string;
}

export interface ModelChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'removed' | 'modified';
}

export interface NotificationPreferences {
  email: string;
  enableEmail: boolean;
  enableBrowser: boolean;
  enableWebhook: boolean;
  webhookUrl?: string;
  notifyOnPriceChange: boolean;
  notifyOnNewModel: boolean;
  notifyOnDeprecation: boolean;
  notifyOnModelUpdate: boolean;
  watchedModels: string[]; // Array of model IDs
  watchedProviders: string[]; // Array of provider names
  minPriceChangePercent: number; // Minimum % change to notify
}

export interface ChangelogEntry {
  id: string;
  modelId: string;
  modelName: string;
  provider: string;
  changeDate: string;
  changeType: 'price' | 'feature' | 'deprecation' | 'new' | 'update';
  changes: ModelChange[];
  version?: string;
  summary: string;
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: '',
  enableEmail: false,
  enableBrowser: true,
  enableWebhook: false,
  webhookUrl: '',
  notifyOnPriceChange: true,
  notifyOnNewModel: true,
  notifyOnDeprecation: true,
  notifyOnModelUpdate: true,
  watchedModels: [],
  watchedProviders: [],
  minPriceChangePercent: 5,
};
