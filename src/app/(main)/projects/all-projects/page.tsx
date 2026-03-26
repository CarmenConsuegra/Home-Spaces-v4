"use client";

import { useMemo } from "react";
import { ProjectsLayout, useProjectsFilter } from "@/components/ProjectsLayout";
import { ProjectCard, NewProjectCard } from "@/components/ProjectCard";
import { useCreateModal } from "@/contexts/CreateModalContext";
import { useFolder } from "@/contexts/FolderContext";

const ME = "Alvaro Castañeda";

function ProjectsGrid() {
  const createModal = useCreateModal();
  const { projects } = useFolder();
  const { visibilityFilter, selectedOwner, projectsSearchQuery } = useProjectsFilter();

  const filtered = useMemo(() => {
    let list = projects;
    if (visibilityFilter === "Shared") list = list.filter((p) => !p.isPrivate);
    else if (visibilityFilter === "Private") list = list.filter((p) => p.isPrivate);
    if (selectedOwner === "Me") list = list.filter((p) => p.owner === ME);
    else if (selectedOwner === "Others") list = list.filter((p) => p.owner !== ME);
    if (projectsSearchQuery.trim())
      list = list.filter((p) => p.name.toLowerCase().includes(projectsSearchQuery.toLowerCase()));
    return list;
  }, [projects, visibilityFilter, selectedOwner, projectsSearchQuery]);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <NewProjectCard onClick={() => createModal?.open()} />
      {filtered.map((project) => (
        <ProjectCard
          key={project.name}
          id={project.name.toLowerCase().replace(/\s+/g, "-")}
          title={project.name}
          cover={project.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"}
          editedAt="Edited recently"
          isPrivate={project.isPrivate ?? true}
          isPinned={false}
          collaborators={project.teamMembers?.map((m) => ({ name: m.initials, color: m.color })) || []}
        />
      ))}
    </div>
  );
}

export default function AllProjectsPage() {
  return (
    <ProjectsLayout title="All projects" projectsHeader>
      <ProjectsGrid />
    </ProjectsLayout>
  );
}
