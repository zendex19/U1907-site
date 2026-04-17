import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const Index = lazy(() => import("./pages/Index"));
const TagsPage = lazy(() => import("./pages/TagsPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<TimelinePage />} />
          <Route path="/blog/:postId" element={<Index />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/:tag" element={<TagsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
