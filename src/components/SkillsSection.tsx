import './SkillsSection.css';

const skills = [
  { name: 'Angular', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', color: '#dd0031' },
  { name: 'React', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61dafb' },
  { name: 'Bootstrap', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', color: '#7952b3' },
  { name: 'Material UI', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg', color: '#0081cb' },
  { name: 'SCSS', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', color: '#cc6699' },
  { name: 'JavaScript', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#f7df1e' },
  { name: 'TypeScript', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: '#3178c6' },
  { name: 'Node.js', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { name: 'MongoDB', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47a248' },
  { name: 'Blockchain', level: 'Intermediate', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg', color: '#363636' },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="skills-section">
      {/* Left: header */}
      <div className="skills-header animate-fade-in-left reveal-on-scroll">
        <span className="section-label">My Skills</span>
        <div className="section-label-line" />
        <h2 className="section-title-serif">Technologies<br />I Work With</h2>
        <p className="skills-desc">
          I specialize in modern web technologies, building everything from sleek frontends to robust APIs and blockchain integrations.
        </p>
      </div>

      {/* Right: skills grid */}
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="skill-card animate-fade-in-up reveal-on-scroll"
            style={{ animationDelay: `${0.1 + index * 0.07}s` }}
          >
            <div className="skill-icon-bg" style={{ background: `${skill.color}18` }}>
              <img src={skill.icon} alt={skill.name} className="skill-icon" />
            </div>
            <div>
              <p className="skill-name">{skill.name}</p>
              <span className="skill-level">{skill.level}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
