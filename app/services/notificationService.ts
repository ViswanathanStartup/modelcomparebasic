// Notification Service - Handles creating and sending notifications

import { Notification as NotificationData, NotificationPreferences, NotificationType, ModelChange, ChangelogEntry, defaultNotificationPreferences } from '../types/notifications';

export class NotificationService {
  private static generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getNotifications(): NotificationData[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  }

  private static saveNotifications(notifications: NotificationData[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  private static getPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') return defaultNotificationPreferences;
    const saved = localStorage.getItem('notification-preferences');
    return saved ? JSON.parse(saved) : defaultNotificationPreferences;
  }

  private static shouldNotify(
    type: NotificationType,
    modelId?: string,
    provider?: string
  ): boolean {
    const prefs = this.getPreferences();
    if (!prefs) return false;

    // Check if this notification type is enabled
    switch (type) {
      case 'price_change':
        if (!prefs.notifyOnPriceChange) return false;
        break;
      case 'new_model':
        if (!prefs.notifyOnNewModel) return false;
        break;
      case 'deprecation':
        if (!prefs.notifyOnDeprecation) return false;
        break;
      case 'model_update':
        if (!prefs.notifyOnModelUpdate) return false;
        break;
    }

    // Check if watching specific models or providers
    if (prefs.watchedModels.length > 0 || prefs.watchedProviders.length > 0) {
      const watchingModel = !!(modelId && prefs.watchedModels.includes(modelId));
      const watchingProvider = !!(provider && prefs.watchedProviders.includes(provider));
      return watchingModel || watchingProvider;
    }

    return true;
  }

  static createNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): NotificationData {
    const newNotification: NotificationData = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const notifications = this.getNotifications();
    notifications.unshift(newNotification);

    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    this.saveNotifications(notifications);
    return newNotification;
  }

  static async sendNotification(notification: NotificationData) {
    const prefs = this.getPreferences();
    if (!prefs) return;

    if (!this.shouldNotify(notification.type, notification.modelId, notification.provider)) {
      return;
    }

    // Browser notification
    if (prefs.enableBrowser && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
        badge: '/badge.png',
        tag: notification.id,
      });
    }

    // Email notification (would be handled by backend)
    if (prefs.enableEmail && prefs.email) {
      await this.sendEmailNotification(prefs.email, notification);
    }

    // Webhook notification
    if (prefs.enableWebhook && prefs.webhookUrl) {
      await this.sendWebhookNotification(prefs.webhookUrl, notification);
    }
  }

  private static async sendEmailNotification(email: string, notification: NotificationData) {
    try {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, notification }),
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  private static async sendWebhookNotification(webhookUrl: string, notification: NotificationData) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
    }
  }

  static notifyPriceChange(
    modelId: string,
    modelName: string,
    provider: string,
    changes: ModelChange[]
  ) {
    const prefs = this.getPreferences();

    // Check if price change meets minimum threshold
    const priceChange = changes.find(c =>
      c.field.toLowerCase().includes('cost') ||
      c.field.toLowerCase().includes('price')
    );

    if (priceChange && prefs?.minPriceChangePercent) {
      const oldPrice = parseFloat(String(priceChange.oldValue).replace(/[^0-9.]/g, ''));
      const newPrice = parseFloat(String(priceChange.newValue).replace(/[^0-9.]/g, ''));
      const percentChange = Math.abs(((newPrice - oldPrice) / oldPrice) * 100);

      if (percentChange < prefs.minPriceChangePercent) {
        return; // Don't notify if below threshold
      }
    }

    const notification = this.createNotification({
      type: 'price_change',
      priority: 'medium',
      title: `Price Change: ${modelName}`,
      message: `Pricing has been updated for ${modelName} by ${provider}`,
      modelId,
      modelName,
      provider,
      changes,
      actionUrl: `/models/${modelId}`,
    });

    this.sendNotification(notification);
  }

  static notifyNewModel(
    modelId: string,
    modelName: string,
    provider: string
  ) {
    const notification = this.createNotification({
      type: 'new_model',
      priority: 'high',
      title: `New Model Released: ${modelName}`,
      message: `${provider} has released a new model: ${modelName}`,
      modelId,
      modelName,
      provider,
      actionUrl: `/models/${modelId}`,
    });

    this.sendNotification(notification);
  }

  static notifyDeprecation(
    modelId: string,
    modelName: string,
    provider: string,
    deprecationDate: string
  ) {
    const notification = this.createNotification({
      type: 'deprecation',
      priority: 'critical',
      title: `Deprecation Warning: ${modelName}`,
      message: `${modelName} by ${provider} will be deprecated on ${new Date(deprecationDate).toLocaleDateString()}`,
      modelId,
      modelName,
      provider,
      actionUrl: `/models/${modelId}`,
    });

    this.sendNotification(notification);
  }

  static notifyModelUpdate(
    modelId: string,
    modelName: string,
    provider: string,
    changes: ModelChange[]
  ) {
    const notification = this.createNotification({
      type: 'model_update',
      priority: 'medium',
      title: `Model Updated: ${modelName}`,
      message: `${modelName} by ${provider} has been updated with new features`,
      modelId,
      modelName,
      provider,
      changes,
      actionUrl: `/models/${modelId}`,
    });

    this.sendNotification(notification);
  }

  static addToChangelog(entry: Omit<ChangelogEntry, 'id'>) {
    if (typeof window === 'undefined') return;

    const changelog = this.getChangelog();
    const newEntry: ChangelogEntry = {
      ...entry,
      id: this.generateId(),
    };

    changelog.unshift(newEntry);

    // Keep only last 200 entries
    if (changelog.length > 200) {
      changelog.splice(200);
    }

    localStorage.setItem('model-changelog', JSON.stringify(changelog));
  }

  private static getChangelog(): ChangelogEntry[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('model-changelog');
    return saved ? JSON.parse(saved) : [];
  }
}
