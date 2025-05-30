
import { User } from "@/types/user";

export enum UserRole {
  CLIENT = 'client',
  BROADCASTER = 'broadcaster',
  ADMIN = 'admin'
}

export const getUserRole = (user: User | null): UserRole => {
  if (!user) return UserRole.CLIENT;
  
  // Admin check
  if (user.is_admin) {
    return UserRole.ADMIN;
  }
  
  // For now, treat everyone else as clients
  // In the future, you could check for broadcaster role in a separate table
  return UserRole.CLIENT;
  
  // Example of how to extend this when you have a roles table:
  // if (user.roles?.includes('broadcaster')) {
  //   return UserRole.BROADCASTER;
  // }
};

export const isAdmin = (user: User | null): boolean => {
  return getUserRole(user) === UserRole.ADMIN;
};

export const isBroadcaster = (user: User | null): boolean => {
  // Currently only admin is broadcaster
  // You can modify this when you implement specific broadcaster roles
  return getUserRole(user) === UserRole.ADMIN;
};
