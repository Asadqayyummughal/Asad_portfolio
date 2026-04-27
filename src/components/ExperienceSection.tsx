import { useState, useEffect } from 'react';
import './ExperienceSection.css';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const defaultExperiences = [
  {
    id: 1,
    role: 'Senior Frontend Developer',
    company: 'Tech Corp',
    period: '2022 – Present',
    description: 'Led the development of a complex enterprise web application using React and TypeScript. Improved performance by 40% and mentored junior developers.',
    technologies: ['React', 'TypeScript', 'Redux', 'Node.js']
  },
  {
    id: 2,
    role: 'Full Stack Engineer',
    company: 'Digital Solutions Inc.',
    period: '2019 – 2022',
    description: 'Developed scalable microservices and responsive front-end interfaces. Integrated blockchain technologies for secure data storage.',
    technologies: ['Angular', 'Node.js', 'MongoDB', 'Solidity']
  },
  {
    id: 3,
    role: 'Web Developer',
    company: 'Creative Agency',
    period: '2017 – 2019',
    description: 'Created highly interactive and visually appealing marketing websites for various clients using modern web technologies.',
    technologies: ['JavaScript', 'SCSS', 'HTML5', 'CSS3']
  }
];

const ExperienceSection = () => {
  const { content: globalContent, updateContent } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const content = globalContent.experience && globalContent.experience.length > 0 
    ? globalContent.experience 
    : defaultExperiences;

  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
    setEditContent(globalContent.experience && globalContent.experience.length > 0 
      ? globalContent.experience 
      : defaultExperiences);
  }, [globalContent.experience]);

  const handleSave = async () => {
    await updateContent('experience', editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newContent = [...editContent];
    if (field === 'technologies') {
      newContent[index].technologies = value.split(',').map(t => t.trim()).filter(t => t);
    } else {
      (newContent[index] as any)[field] = value;
    }
    setEditContent(newContent);
  };

  const handleAddItem = () => {
    setEditContent([
      ...editContent,
      {
        id: Date.now(),
        role: 'New Role',
        company: 'New Company',
        period: 'Year - Year',
        description: 'Describe your responsibilities and achievements...',
        technologies: ['Skill 1', 'Skill 2']
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newContent = [...editContent];
    newContent.splice(index, 1);
    setEditContent(newContent);
  };

  return (
    <section id="experience" className="experience-section">
      {/* Left: header */}
      <div className="exp-header animate-fade-in-left reveal-on-scroll">
        <span className="section-label">My Experience</span>
        <div className="section-label-line" />
        <h2 className="section-title-serif">Professional<br />Journey</h2>
        
        {/* Admin controls placed INSIDE the header — no overlap */}
        {isAdmin && (
          <div className="exp-admin-controls">
            {isEditing ? (
              <>
                <button className="edit-btn-dark edit-btn--save" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
                <button className="edit-btn-dark edit-btn--cancel" onClick={handleCancel}>
                  <X size={16} /> Cancel
                </button>
                <button className="btn-outline-pill" onClick={handleAddItem} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                  <Plus size={16} /> Add Position
                </button>
              </>
            ) : (
              <button className="edit-btn-dark" onClick={() => setIsEditing(true)}>
                <Edit size={16} /> Edit Experience
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: timeline */}
      <div className="exp-timeline">
        {(isEditing ? editContent : content).map((exp, index) => (
          <div
            key={exp.id}
            className="exp-item animate-fade-in-up reveal-on-scroll"
            style={{ animationDelay: `${0.15 + index * 0.15}s` }}
          >
            <div className="exp-dot" />
            <div className="exp-card" style={isEditing ? { border: '1px solid var(--coral)' } : {}}>
              
              {isEditing && (
                <button 
                  onClick={() => handleRemoveItem(index)}
                  className="exp-card__remove"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="exp-card__top">
                <div style={{ width: isEditing ? '100%' : 'auto' }}>
                  {isEditing ? (
                    <>
                      <input 
                        className="form-input" 
                        value={exp.role} 
                        onChange={(e) => handleUpdateItem(index, 'role', e.target.value)}
                        style={{ marginBottom: '8px', fontWeight: 'bold' }}
                      />
                      <input 
                        className="form-input" 
                        value={exp.company} 
                        onChange={(e) => handleUpdateItem(index, 'company', e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="exp-role">{exp.role}</h3>
                      <p className="exp-company">{exp.company}</p>
                    </>
                  )}
                </div>
                
                {isEditing ? (
                  <input 
                    className="form-input" 
                    value={exp.period} 
                    onChange={(e) => handleUpdateItem(index, 'period', e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                ) : (
                  <span className="exp-period">{exp.period}</span>
                )}
              </div>

              {isEditing ? (
                <textarea 
                  className="form-textarea" 
                  value={exp.description} 
                  onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                  style={{ margin: '16px 0', minHeight: '80px' }}
                />
              ) : (
                <p className="exp-desc">{exp.description}</p>
              )}

              <div className="exp-tags">
                {isEditing ? (
                  <input 
                    className="form-input" 
                    value={exp.technologies.join(', ')} 
                    onChange={(e) => handleUpdateItem(index, 'technologies', e.target.value)}
                    placeholder="Comma separated tags (e.g. React, Node)"
                  />
                ) : (
                  exp.technologies.map((tech: string, i: number) => (
                    <span key={i} className="exp-tag">{tech}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
