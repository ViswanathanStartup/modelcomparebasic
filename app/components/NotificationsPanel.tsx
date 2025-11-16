'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, DollarSign, AlertTriangle, Sparkles, Info, Settings, Trash2 } from 'lucide-react';
import { Notification, NotificationType } from '../types/notifications';
import Link from 'next/link';

interface NotificationsPanelProps {
  onOpenPreferences?: () => void;
}

export default function NotificationsPanel({ onOpenPreferences }: NotificationsPanelProps = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const saveNotifications = (notifs: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(notifs));
    setNotifications(notifs);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      saveNotifications([]);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'price_change':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'deprecation':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'new_model':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'model_update':
        return <Info className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-4 border-red-600';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="hidden sm:inline">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="relative">
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenPreferences?.();
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Notification Settings"
                  >
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto">
                {['all', 'price_change', 'new_model', 'deprecation', 'model_update'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      filter === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenPreferences?.();
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                  >
                    Configure your notification preferences
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      } ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.modelName && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                              {notification.provider} • {notification.modelName}
                            </div>
                          )}
                          {notification.changes && notification.changes.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {notification.changes.slice(0, 2).map((change, idx) => (
                                <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                                  <span className="font-medium">{change.field}:</span>{' '}
                                  <span className="text-red-600 line-through">{String(change.oldValue)}</span>
                                  {' → '}
                                  <span className="text-green-600">{String(change.newValue)}</span>
                                </div>
                              ))}
                              {notification.changes.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{notification.changes.length - 2} more changes
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  onClick={() => setIsOpen(false)}
                                >
                                  View Details
                                </Link>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
