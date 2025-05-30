// Type declarations for Deno runtime
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }

  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function serveHttp(conn: Deno.Conn): Promise<Deno.HttpConn>;
  
  export interface HttpConn {
    nextRequest(): Promise<{ request: Request; respondWith(r: Response | Promise<Response>): Promise<void> } | null>;
    close(): void;
  }
  
  export interface Conn {
    readonly rid: number;
    close(): void;
    readonly localAddr: Deno.Addr;
    readonly remoteAddr: Deno.Addr;
  }
  
  export interface Addr {
    transport: "tcp" | "udp";
    hostname: string;
    port: number;
  }
  
  export interface ConnInfo {
    readonly localAddr: Deno.Addr;
    readonly remoteAddr: Deno.Addr;
  }
  
  export const env: Env;
}

// Type declarations for Deno standard library modules
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(
    handler: (req: Request, connInfo?: Deno.ConnInfo) => Response | Promise<Response>,
    options?: {
      port?: number;
      hostname?: string;
      signal?: AbortSignal;
      onListen?: (params: { hostname: string; port: number }) => void;
    }
  ): void;
}

// Type declarations for Supabase JS client in Deno
declare module "https://esm.sh/@supabase/supabase-js@2.7.1" {
  export * from "@supabase/supabase-js";
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export * from "@supabase/supabase-js";
}
