"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const notifications = [
  {
    id: 1,
    type: "message",
    title: "New message from John Doe",
    description: "Hey, how are you doing?",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "System Update",
    description: "Your system will be updated in 30 minutes.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 3,
    type: "info",
    title: "New Feature Available",
    description: "Check out our new dashboard layout!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "success",
    title: "Project Completed",
    description: 'Your project "Website Redesign" has been marked as complete.',
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    type: "mention",
    title: "You were mentioned in a comment",
    description: "@johndoe mentioned you in Project X discussion.",
    time: "2 days ago",
    read: false,
  },
];

export default function NotificationsView() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-primary" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "info":
        return <Info className="h-5 w-5 text-info" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "mention":
        return <User className="h-5 w-5 text-warning" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotificationList(
      notificationList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList(
      notificationList.filter((notification) => notification.id !== id),
    );
  };

  const filteredNotifications =
    activeTab === "all"
      ? notificationList
      : notificationList.filter((notification) => !notification.read);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
          <CardDescription>
            Stay updated with your latest notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Notifications</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 p-4 border-b last:border-b-0"
                >
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="unread" className="mt-6">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 p-4 border-b last:border-b-0"
                >
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
