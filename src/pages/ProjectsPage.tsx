import { TopBar } from "@/components/blog/TopBar";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

const ProjectsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar showMenuButton={false} />
      <main className="flex-1 py-16 md:py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1100px] mx-auto">
          <header className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Projects
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-[640px] leading-relaxed">
              A small collection of things I've built — fun tools, scripts that
              quietly run my life, and terminal apps!.
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, i) => {
              const href = project.url || project.repo;
              const Card = (
                <article
                  className="group h-full flex flex-col rounded-lg overflow-hidden border border-border hover:border-muted-foreground/40 transition-colors animate-fade-in opacity-0"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  {/* CHANGED THIS SECTION: Removed aspect ratio, updated image sizing */}
                  <div className="overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-[17px] font-semibold tracking-tight text-foreground group-hover:text-accent-link transition-colors">
                        {project.title}
                      </h2>
                      {href && (
                        <ArrowUpRight className="w-4 h-4 mt-1 text-muted-foreground/70 group-hover:text-foreground transition-colors shrink-0" />
                      )}
                    </div>
                    <p className="text-[14px] leading-relaxed text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-muted-foreground/80 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.year && (
                        <span className="ml-auto text-[11px] text-muted-foreground/60">
                          {project.year}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );

              return (
                <li key={project.id}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full no-underline"
                    >
                      {Card}
                    </a>
                  ) : (
                    Card
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;