import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { ScrollToTop } from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import TrackingScripts from "@/components/TrackingScripts";
import PageViewTracker from "@/components/PageViewTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/admin/PrivateRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load - public secondary pages
const LiveStream = React.lazy(() => import("./pages/LiveStream"));
const RanchoDetalhes = React.lazy(() => import("./pages/RanchoDetalhes"));
const PackageVip = React.lazy(() => import("./pages/PackageVip"));
const PackageLuxo = React.lazy(() => import("./pages/PackageLuxo"));
const PackageDiamante = React.lazy(() => import("./pages/PackageDiamante"));
const PackagesIndex = React.lazy(() => import("./pages/PackagesIndex"));
const PackagesIndexDynamic = React.lazy(() => import("./pages/PackagesIndexDynamic"));
const PacoteDetalhes = React.lazy(() => import("./pages/PacoteDetalhes"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));

// Lazy load - admin pages
const AdminLogin = React.lazy(() => import("./pages/admin/Login"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminRanchos = React.lazy(() => import("./pages/admin/Ranchos"));
const RanchoNovo = React.lazy(() => import("./pages/admin/RanchoNovo"));
const RanchoEditar = React.lazy(() => import("./pages/admin/RanchoEditar"));
const AdminPacotes = React.lazy(() => import("./pages/admin/Pacotes"));
const PacoteNovo = React.lazy(() => import("./pages/admin/PacoteNovo"));
const PacoteEditar = React.lazy(() => import("./pages/admin/PacoteEditar"));
const PacoteAnalytics = React.lazy(() => import("./pages/admin/PacoteAnalytics"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const BlogNovo = React.lazy(() => import("./pages/admin/BlogNovo"));
const BlogEditar = React.lazy(() => import("./pages/admin/BlogEditar"));
const BlogAnalytics = React.lazy(() => import("./pages/admin/BlogAnalytics"));
const AdminConfiguracoes = React.lazy(() => import("./pages/admin/Configuracoes"));
const WhatsAppConfig = React.lazy(() => import("./pages/admin/WhatsAppConfig"));
const WhatsAppAnalytics = React.lazy(() => import("./pages/admin/WhatsAppAnalytics"));
const Ajuda = React.lazy(() => import("./pages/admin/Ajuda"));
const ConfiguracoesVideos = React.lazy(() => import("./pages/admin/ConfiguracoesVideos"));
const Anuncios = React.lazy(() => import("./pages/admin/Anuncios"));
const AnuncioNovo = React.lazy(() => import("./pages/admin/AnuncioNovo"));
const AnuncioEditar = React.lazy(() => import("./pages/admin/AnuncioEditar"));
const AdminAvaliacoes = React.lazy(() => import("./pages/admin/Avaliacoes"));
const EstatisticasAvaliacoes = React.lazy(() => import("./pages/admin/EstatisticasAvaliacoes"));
const AdminAnalytics = React.lazy(() => import("./pages/admin/Analytics"));
const FAQs = React.lazy(() => import("./pages/admin/FAQs"));
const FAQNovo = React.lazy(() => import("./pages/admin/FAQNovo"));
const FAQEditar = React.lazy(() => import("./pages/admin/FAQEditar"));
const Depoimentos = React.lazy(() => import("./pages/admin/Depoimentos"));
const DepoimentoNovo = React.lazy(() => import("./pages/admin/DepoimentoNovo"));
const DepoimentoEditar = React.lazy(() => import("./pages/admin/DepoimentoEditar"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PWALifecycle />
            <DynamicFavicon />
            <BrowserRouter>
            <ScrollToTop />
            <PageViewTracker />
            <AuthProvider>
              <TrackingScripts />
              <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/rancho/:slug" element={<RanchoDetalhes />} />
                <Route path="/pacotes" element={<PackagesIndexDynamic />} />
                <Route path="/pacote/:slug" element={<PacoteDetalhes />} />
                <Route path="/pacotes-estaticos" element={<PackagesIndex />} />
                <Route path="/pacote/vip" element={<PackageVip />} />
                <Route path="/pacote/luxo" element={<PackageLuxo />} />
                <Route path="/pacote/diamante" element={<PackageDiamante />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/pacote-vip" element={<PackageVip />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="ranchos" element={<AdminRanchos />} />
                  <Route path="ranchos/novo" element={<RanchoNovo />} />
                  <Route path="ranchos/editar/:id" element={<RanchoEditar />} />
                  <Route path="pacotes" element={<AdminPacotes />} />
                  <Route path="pacotes/novo" element={<PacoteNovo />} />
                  <Route path="pacotes/:id/editar" element={<PacoteEditar />} />
                  <Route path="pacotes/analytics" element={<PacoteAnalytics />} />
                  <Route path="avaliacoes" element={<AdminAvaliacoes />} />
                  <Route path="estatisticas-avaliacoes" element={<EstatisticasAvaliacoes />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="blog/novo" element={<BlogNovo />} />
                  <Route path="blog/editar/:id" element={<BlogEditar />} />
                  <Route path="blog/analytics" element={<BlogAnalytics />} />
                  <Route path="faqs" element={<FAQs />} />
                  <Route path="faqs/novo" element={<FAQNovo />} />
                  <Route path="faqs/editar/:id" element={<FAQEditar />} />
                  <Route path="depoimentos" element={<Depoimentos />} />
                  <Route path="depoimentos/novo" element={<DepoimentoNovo />} />
                  <Route path="depoimentos/editar/:id" element={<DepoimentoEditar />} />
                  <Route path="anuncios" element={<Anuncios />} />
                  <Route path="anuncios/novo" element={<AnuncioNovo />} />
                  <Route path="anuncios/editar/:id" element={<AnuncioEditar />} />
                  <Route path="configuracoes" element={<AdminConfiguracoes />} />
                  <Route path="whatsapp-config" element={<WhatsAppConfig />} />
                  <Route path="whatsapp-analytics" element={<WhatsAppAnalytics />} />
                  <Route path="videos" element={<ConfiguracoesVideos />} />
                  <Route path="ajuda" element={<Ajuda />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;