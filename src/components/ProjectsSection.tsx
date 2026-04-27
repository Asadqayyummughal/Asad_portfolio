import { useState, useEffect } from 'react';
import './ProjectsSection.css';
import { ExternalLink, Github, Plus, Trash2, Edit, Save, X, Image } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: { live: string; github: string };
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured modern e-commerce platform built with React, Node.js, and MongoDB. Includes authentication, payment processing, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    links: { live: '#', github: '#' }
  },
  {
    id: 2,
    title: 'Crypto Dashboard',
    description: 'Real-time cryptocurrency tracking dashboard with interactive charts, portfolio management, and market news integration.',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80',
    tags: ['TypeScript', 'React', 'CoinGecko API'],
    links: { live: '#', github: '#' }
  },
  {
    id: 3,
    title: 'Task Management App',
    description: 'A collaborative task management tool with real-time updates, drag-and-drop boards, and team workspaces.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io'],
    links: { live: '#', github: '#' }
  }
];

const ProjectsSection = () => {
  const { content: globalContent, updateContent } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = globalContent.projects && globalContent.projects.length > 0
    ? globalContent.projects
    : defaultProjects;

  const [editProjects, setEditProjects] = useState<Project[]>(projects);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
    setEditProjects(
      globalContent.projects && globalContent.projects.length > 0
        ? globalContent.projects
        : defaultProjects
    );
  }, [globalContent.projects]);

  const handleSave = async () => {
    await updateContent('projects', editProjects);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProjects(projects);
    setIsEditing(false);
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updated = [...editProjects];
    if (field === 'tags') {
      updated[index].tags = value.split(',').map(t => t.trim()).filter(t => t);
    } else if (field === 'live' || field === 'github') {
      updated[index].links = { ...updated[index].links, [field]: value };
    } else {
      (updated[index] as any)[field] = value;
    }
    setEditProjects(updated);
  };

  const handleAddProject = () => {
    setEditProjects([
      ...editProjects,
      {
        id: Date.now(),
        title: 'New Project',
        description: 'Describe your project here...',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        tags: ['React', 'TypeScript'],
        links: { live: '#', github: '#' }
      }
    ]);
  };

  const handleRemoveProject = (index: number) => {
    const updated = [...editProjects];
    updated.splice(index, 1);
    setEditProjects(updated);
  };

  const handleProjectClick = (project: Project) => {
    if (isEditing) return; // Don't open modal while editing
    setSelectedProject(project);
  };

  return (
    <section id="projects" className="projects-section">
      {/* Header */}
      <div className="projects-header animate-fade-in-up reveal-on-scroll">
        <div className="projects-header__left">
          <span className="section-label">My Work</span>
          <div className="section-label-line" />
          <h2 className="section-title-serif">Featured<br />Projects</h2>
          
          {/* Admin controls inside header */}
          {isAdmin && (
            <div className="projects-admin-controls">
              {isEditing ? (
                <>
                  <button className="edit-btn-dark edit-btn--save" onClick={handleSave}>
                    <Save size={16} /> Save
                  </button>
                  <button className="edit-btn-dark edit-btn--cancel" onClick={handleCancel}>
                    <X size={16} /> Cancel
                  </button>
                  <button className="btn-outline-pill" onClick={handleAddProject} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                    <Plus size={16} /> Add Project
                  </button>
                </>
              ) : (
                <button className="edit-btn-dark" onClick={() => setIsEditing(true)}>
                  <Edit size={16} /> Edit Projects
                </button>
              )}
            </div>
          )}
        </div>
        <p className="projects-intro">
          A selection of projects that showcase my skills in building full-stack web applications — from concept to deployment.
        </p>
      </div>

      {/* Grid */}
      <div className="projects-grid">
        {(isEditing ? editProjects : projects).map((project, index) => (
          <div
            key={project.id}
            className={`project-card animate-fade-in-up reveal-on-scroll ${isEditing ? 'project-card--editing' : ''}`}
            style={{ animationDelay: `${0.15 + index * 0.15}s` }}
            onClick={() => handleProjectClick(project)}
          >
            {/* Remove button */}
            {isEditing && (
              <button 
                className="project-remove-btn"
                onClick={(e) => { e.stopPropagation(); handleRemoveProject(index); }}
                title="Remove Project"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="project-img-wrap">
              {isEditing ? (
                <div className="project-img-edit">
                  <Image size={24} />
                  <input 
                    className="form-input"
                    value={project.image}
                    onChange={(e) => handleUpdateProject(index, 'image', e.target.value)}
                    placeholder="Image URL..."
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: '0.75rem' }}
                  />
                </div>
              ) : (
                <>
                  <img src={project.image} alt={project.title} className="project-img" />
                  {/* Hover overlay only in non-edit mode, no click needed — modal handles it */}
                  <div className="project-overlay">
                    <div className="project-lighthouse">
                      <div className="lighthouse-item">
                        <div className="lighthouse-circle" style={{ borderColor: '#00e676' }}>98</div>
                        <span>Perf</span>
                      </div>
                      <div className="lighthouse-item">
                        <div className="lighthouse-circle" style={{ borderColor: '#00e676' }}>100</div>
                        <span>SEO</span>
                      </div>
                      <div className="lighthouse-item">
                        <div className="lighthouse-circle" style={{ borderColor: '#00e676' }}>95</div>
                        <span>A11y</span>
                      </div>
                    </div>
                    <span className="project-overlay__text">View Case Study</span>
                  </div>
                </>
              )}
            </div>

            <div className="project-body">
              {isEditing ? (
                <>
                  <input
                    className="form-input"
                    value={project.title}
                    onChange={(e) => handleUpdateProject(index, 'title', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontWeight: 'bold', marginBottom: '10px' }}
                  />
                  <textarea
                    className="form-textarea"
                    value={project.description}
                    onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ minHeight: '60px', marginBottom: '10px' }}
                  />
                  <input
                    className="form-input"
                    value={project.tags.join(', ')}
                    onChange={(e) => handleUpdateProject(index, 'tags', e.target.value)}
                    placeholder="Comma separated tags"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: '0.8rem', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="form-input"
                      value={project.links.live}
                      onChange={(e) => handleUpdateProject(index, 'live', e.target.value)}
                      placeholder="Live URL"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <input
                      className="form-input"
                      value={project.links.github}
                      onChange={(e) => handleUpdateProject(index, 'github', e.target.value)}
                      placeholder="GitHub URL"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Project Action Modal ── */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal__close" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>
            <img src={selectedProject.image} alt={selectedProject.title} className="project-modal__img" />
            <h3 className="project-modal__title">{selectedProject.title}</h3>
            <p className="project-modal__desc">{selectedProject.description}</p>
            <div className="project-modal__tags">
              {selectedProject.tags.map((tag, i) => (
                <span key={i} className="project-tag">{tag}</span>
              ))}
            </div>
            <div className="project-modal__actions">
              <button 
                className="btn-pill" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => alert('Case Study feature coming soon! Contact for a deep dive.')}
              >
                Read Case Study
              </button>
              <div className="project-modal__links">
                <a 
                  href={selectedProject.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-coral"
                  aria-label={`View live demo of ${selectedProject.title}`}
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
                <a 
                  href={selectedProject.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline-pill"
                  aria-label={`View GitHub repository for ${selectedProject.title}`}
                >
                  <Github size={16} /> Source
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
