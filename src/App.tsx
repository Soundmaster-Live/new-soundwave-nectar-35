
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthStateManager from "./components/auth/AuthStateManager";
import AppRoutes from "./components/routing/AppRoutes";
import ChatBot from "./components/ChatBot";
import { AdminProvider } from "./contexts/AdminContext";
import { AuthProvider } from "./hooks/use-auth.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      meta: {
        errorHandler: (error: any) => {
          console.error('Query error:', error);
        },
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <TooltipProvider>
            <AuthProvider>
              <AdminProvider>
                <div className="min-h-screen flex flex-col bg-background">
                  <Navbar />
                  <main className="flex-grow pt-16">
                    <AppRoutes />
                  </main>
                  <Footer />
                  <div className="fixed bottom-4 right-4 z-50">
                    <ChatBot />
                  </div>
                  <Toaster />
                  <Sonner />
                </div>
                <AuthStateManager queryClient={queryClient} />
              </AdminProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
