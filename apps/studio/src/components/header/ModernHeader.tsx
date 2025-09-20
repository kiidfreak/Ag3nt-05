/**
 * Modern Header Component
 * Beautiful header with navigation, user menu, and quick actions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Zap,
  Play,
  Save,
  Download,
  Upload,
  Share,
  HelpCircle,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onSave?: () => void;
  onRun?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onShare?: () => void;
  isRunning?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  onMenuClick,
  onSave,
  onRun,
  onExport,
  onImport,
  onShare,
  isRunning = false,
  hasUnsavedChanges = false,
  className = '',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifications = [
    { id: 1, title: 'Workflow completed', message: 'Your data processing workflow has finished successfully', time: '2 min ago', unread: true },
    { id: 2, title: 'New agent available', message: 'GPT-4 agent has been added to the library', time: '1 hour ago', unread: true },
    { id: 3, title: 'System update', message: 'Agent OS has been updated to version 2.1.0', time: '3 hours ago', unread: false },
  ];

  const userMenuItems = [
    { label: 'Profile', icon: User, onClick: () => {} },
    { label: 'Settings', icon: Settings, onClick: () => {} },
    { label: 'Help', icon: HelpCircle, onClick: () => {} },
    { label: 'Sign Out', icon: LogOut, onClick: () => {}, danger: true },
  ];

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Center Section - Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={isRunning ? 'warning' : 'success'}
            size="sm"
            onClick={onRun}
            leftIcon={isRunning ? <Zap className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            leftIcon={<Save className="w-4 h-4" />}
            className={hasUnsavedChanges ? 'ring-2 ring-orange-500' : ''}
          >
            Save
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onImport}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Import
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onShare}
            leftIcon={<Share className="w-4 h-4" />}
          >
            Share
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {/* Language Selector */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Globe className="w-4 h-4" />
          </Button>
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 z-50"
                >
                  <Card variant="elevated" className="p-0">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <Button variant="ghost" size="sm" fullWidth>
                        View All Notifications
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 z-50"
                >
                  <Card variant="elevated" className="p-0">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">John Doe</h4>
                          <p className="text-xs text-gray-500">john@example.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              item.onClick();
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              item.danger
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
