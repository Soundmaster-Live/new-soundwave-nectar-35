import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabase";

/**
 * Converts a Supabase User to our application User type
 * by fetching additional profile information
 */
export async function convertToAppUser(supabaseUser: SupabaseUser | null): Promise<User | null> {
  if (!supabaseUser) return null;
  
  try {
    // Fetch the user's profile from the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      // Return a minimal user object if we can't fetch the profile
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || undefined,
        username: supabaseUser.email?.split("@")[0] || null,
        is_admin: false,
        created_at: supabaseUser.created_at || new Date().toISOString(),
      };
    }
    
    // Return the combined user data
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || undefined,
      username: data.username || supabaseUser.email?.split("@")[0] || null,
      is_admin: data.is_admin || false,
      created_at: data.created_at || supabaseUser.created_at || new Date().toISOString(),
      avatar_url: data.avatar_url || null,
    };
  } catch (error) {
    console.error("Error in convertToAppUser:", error);
    return null;
  }
}

/**
 * Creates a placeholder user object for TypeScript compatibility
 */
export function createPlaceholderUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || undefined,
    username: supabaseUser.email?.split("@")[0] || null,
    is_admin: false,
    created_at: supabaseUser.created_at || new Date().toISOString(),
    avatar_url: supabaseUser.user_metadata?.avatar_url || null,
  };
}
