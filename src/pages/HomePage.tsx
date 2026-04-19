import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "@/components/blog/TopBar";
import { Footer } from "@/components/Footer";
import { loadMarkdownPosts, type BlogPost } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react"; // Removed ArrowUpRight

const HomePage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const loadedPosts = await loadMarkdownPosts();
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar showMenuButton={false} />
      <main className="flex-1 py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
        <div className="max-w-[640px] mx-auto">
          {/* Author Section */}
          <section className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/pfp.webp"
                alt="zendex"
                width={96}
                height={96}
                fetchPriority="high"
                className="w-24 h-24 rounded-full object-cover shrink-0"
              />
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                zendex
              </h1>
            </div>
            <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-4">
              I spend most of my time homelabbing and tinkering with self-hosted stuff.
              I automate pretty much everything I can.
              Lately, I've been getting into malware analysis — it's actually fun!
            </p>
            <p className="text-foreground/80 text-sm">
              Systems Thinker ·
              <a href="mailto:zendexino@gmail.com" className="ml-1 underline underline-offset-4 hover:text-foreground transition-colors">
                zendexino@gmail.com
              </a>
            </p>
          </section>

          {/* Recent Writings */}
          <section className="mb-16 md:mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Recent Writings
              </h2>
              <Link
                to="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-muted-foreground text-sm">Loading...</div>
            ) : (
              <ul className="space-y-1">
                {recentPosts.map((post, index) => (
                  <li
                    key={post.id}
                    className="animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                  >
                    <Link
                      to={`/blog/${post.id}`}
                      className="group flex items-baseline justify-between py-3 border-b border-border hover:border-muted-foreground/30 transition-colors"
                    >
                      <span className="text-foreground group-hover:text-muted-foreground transition-colors font-medium">
                        {post.title}
                      </span>
                      {post.date && (
                        <span className="text-xs text-muted-foreground ml-4 shrink-0">
                          {post.date}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;