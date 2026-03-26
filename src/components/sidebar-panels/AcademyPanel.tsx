"use client";

import { useState } from "react";
import {
  MagnifyingGlass,
  CaretDown,
  Notebook,
  PlayCircle,
  Article,
  GearSix,
  ArrowSquareOut,
  Circle,
  CheckCircle,
} from "@phosphor-icons/react";
import { useSpotlight } from "@/contexts/SpotlightContext";

type VideoItem = {
  label: string;
  watched: boolean;
};

type LessonItem = {
  id: string;
  label: string;
  videos: VideoItem[];
};

type CourseItem = {
  id: string;
  label: string;
  lessons: LessonItem[];
};

const courses: CourseItem[] = [
  {
    id: "ai-suite-fundamentals",
    label: "AI suite fundamentals",
    lessons: [
      {
        id: "navigation",
        label: "Navigation",
        videos: [
          { label: "Introduction to the AI suite", watched: true },
        ],
      },
      {
        id: "image-generation",
        label: "Image generation",
        videos: [
          { label: "Introduction to the image generation tool", watched: true },
          { label: "Image generation prompts and references", watched: true },
          { label: "Image generation using camera, color and style", watched: false },
          { label: "From photo to AI generated image using styles", watched: false },
        ],
      },
      {
        id: "image-editing",
        label: "Image editing",
        videos: [
          { label: "Introduction to the image editor", watched: false },
          { label: "Inpainting and outpainting", watched: false },
          { label: "Using layers and masks", watched: false },
        ],
      },
      {
        id: "audio-generation",
        label: "Audio generation",
        videos: [
          { label: "Introduction to audio generation", watched: false },
          { label: "Voice cloning and sound effects", watched: false },
        ],
      },
      {
        id: "video-generation",
        label: "Video generation",
        videos: [
          { label: "Introduction to video generation", watched: false },
          { label: "Video generation from images", watched: false },
          { label: "Advanced video generation settings", watched: false },
        ],
      },
      {
        id: "video-image-audio",
        label: "Video/Image/Audio",
        videos: [
          { label: "Combining video, image and audio", watched: false },
          { label: "Creating a complete project", watched: false },
        ],
      },
    ],
  },
];

const helpItems = [
  { id: "documentation", label: "Documentation", icon: Article, href: "#" },
  { id: "support", label: "Support", icon: GearSix, href: "#" },
];

export function AcademyPanel() {
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [expandedCourseItems, setExpandedCourseItems] = useState<Record<string, boolean>>({
    "ai-suite-fundamentals": true,
  });
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    "navigation": true,
    "image-generation": true,
  });
  const spotlight = useSpotlight();

  const toggleCourse = (id: string) => {
    setExpandedCourseItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLesson = (id: string) => {
    setExpandedLessons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Search */}
      <div className="px-3 pt-0 pb-2">
        <div
          className="relative cursor-pointer"
          onClick={() => spotlight?.open(sidebarSearchQuery)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              spotlight?.open(sidebarSearchQuery);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open search"
        >
          <MagnifyingGlass
            weight="bold"
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50"
            style={{ color: "var(--surface-foreground-2)" }}
          />
          <input
            type="text"
            placeholder="Search"
            value={sidebarSearchQuery}
            onChange={(e) => setSidebarSearchQuery(e.target.value)}
            readOnly
            className="w-full rounded-lg border px-7 pr-16 py-1.5 text-xs outline-none transition-colors focus:border-[var(--primary)] cursor-pointer"
            style={{
              background: "transparent",
              borderColor: "var(--surface-border-alpha-0)",
              color: "var(--surface-foreground-0)",
            }}
          />
          <kbd
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded px-1 py-0.5 text-[12px] font-normal opacity-40"
            style={{
              color: "var(--surface-foreground-2)",
            }}
          >
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      <div className="flex h-8 items-center px-3">
        <span className="text-[13px] font-medium opacity-50" style={{ color: "var(--surface-foreground-2)" }}>
          Academy
        </span>
      </div>

      <div className="mt-2 flex-1 overflow-auto px-2">
        {/* Courses - expandable top-level item */}
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
              style={{
                color: "var(--surface-foreground-0)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Notebook weight="bold" size={14} className="shrink-0 opacity-50" />
              <span className="truncate">Courses</span>
            </button>
            <div>
              <ul
                className="ml-4 mt-0.5 space-y-0 pb-0.5"
              >
                {courses.map((course) => {
                  const isExpanded = expandedCourseItems[course.id];
                  return (
                    <li key={course.id}>
                      <div
                        className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg pl-3 pr-3 text-left text-[13px] transition-colors"
                        style={{
                          color: "var(--surface-foreground-2)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourse(course.id);
                          }}
                          className="flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors -ml-1"
                          style={{ padding: 0 }}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <CaretDown
                            weight="bold"
                            size={14}
                            className={`shrink-0 opacity-50 transition-transform ${isExpanded ? "duration-200 ease-in-out rotate-0" : "duration-200 ease-out -rotate-90"}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCourse(course.id)}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
                          style={{ color: "inherit" }}
                        >
                          <span className="min-w-0 flex-1 truncate">{course.label}</span>
                        </button>
                      </div>
                      <div
                        className={isExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
                        style={{
                          maxHeight: isExpanded ? 1200 : 0,
                          opacity: isExpanded ? 1 : 0,
                          transition: `max-height 0.2s ${isExpanded ? "ease-in-out" : "ease-out"}, opacity 0.2s ${isExpanded ? "ease-in-out" : "ease-out"}`,
                        }}
                      >
                        <ul
                          className="ml-2 mt-0.5 space-y-0 border-l pl-2 pb-0.5"
                          style={{ borderColor: "transparent" }}
                        >
                          {course.lessons.map((lesson, index) => {
                            const lessonExpanded = expandedLessons[lesson.id];
                            const num = String(index + 1).padStart(2, "0");
                            return (
                              <li key={lesson.id}>
                                <div
                                  className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg pl-3 pr-3 text-left text-[13px] transition-colors"
                                  style={{
                                    color: "var(--surface-foreground-2)",
                                    background: "transparent",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLesson(lesson.id);
                                    }}
                                    className="flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors -ml-1"
                                    style={{ padding: 0 }}
                                    aria-label={lessonExpanded ? "Collapse" : "Expand"}
                                  >
                                    <CaretDown
                                      weight="bold"
                                      size={14}
                                      className={`shrink-0 opacity-50 transition-transform ${lessonExpanded ? "duration-200 ease-in-out rotate-0" : "duration-200 ease-out -rotate-90"}`}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleLesson(lesson.id)}
                                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 text-left"
                                    style={{ color: "inherit" }}
                                  >
                                    <span className="min-w-0 flex-1 truncate">
                                      {num}. {lesson.label}
                                    </span>
                                  </button>
                                </div>
                                <div
                                  className={lessonExpanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
                                  style={{
                                    maxHeight: lessonExpanded ? 300 : 0,
                                    opacity: lessonExpanded ? 1 : 0,
                                    transition: `max-height 0.2s ${lessonExpanded ? "ease-in-out" : "ease-out"}, opacity 0.2s ${lessonExpanded ? "ease-in-out" : "ease-out"}`,
                                  }}
                                >
                                  <ul
                                    className="ml-4 mt-0.5 space-y-0 pb-0.5"
                                  >
                                    {lesson.videos.map((video) => (
                                      <li key={video.label}>
                                        <button
                                          type="button"
                                          className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left text-[13px] transition-colors hover:bg-white/5"
                                          style={{ color: "var(--surface-foreground-2)" }}
                                        >
                                          {video.watched ? (
                                            <CheckCircle weight="fill" size={14} className="shrink-0" style={{ color: "white" }} />
                                          ) : (
                                            <Circle weight="bold" size={14} className="shrink-0 opacity-30" />
                                          )}
                                          <span className="truncate">{video.label}</span>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>

          {/* Videos */}
          <li>
            <button
              type="button"
              className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
              style={{
                background: "transparent",
                color: "var(--surface-foreground-0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <PlayCircle weight="bold" size={14} className="shrink-0 opacity-50" />
              <span className="truncate">Videos</span>
            </button>
          </li>
        </ul>

        {/* Help section */}
        <h2
          className="mb-0.5 mt-4 flex h-8 items-center px-1 text-[13px] font-medium opacity-50"
          style={{ color: "var(--surface-foreground-2)" }}
        >
          Help
        </h2>
        <ul className="space-y-0.5">
          {helpItems.map(({ id, label, icon: Icon, href }) => (
            <li key={id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] transition-colors"
                style={{
                  background: "transparent",
                  color: "var(--surface-foreground-0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon weight="bold" size={14} className="shrink-0 opacity-50" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <ArrowSquareOut weight="bold" size={14} className="shrink-0 opacity-40" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
