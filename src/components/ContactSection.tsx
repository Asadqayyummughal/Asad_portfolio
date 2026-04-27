import { useState, useEffect } from 'react';
import './ContactSection.css';
import { Mail, Phone, MapPin, Send, Edit, Save, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const ContactSection = () => {
  const { content: globalContent, updateContent } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultContact = {
    email: 'hello@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA'
  };

  const content = { ...defaultContact, ...(globalContent.contact || {}) };
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
    setEditContent({ ...defaultContact, ...(globalContent.contact || {}) });
  }, [globalContent.contact]);

  const handleSave = async () => {
    await updateContent('contact', editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <section id="contact" className="contact-section">
      {/* Left: Info */}
      <div className="contact-info animate-fade-in-left reveal-on-scroll" style={{position: 'relative'}}>
        {isAdmin && (
          <div className="admin-edit-control" style={{ position: 'absolute', top: 20, right: 20, borderTop: 'none' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="edit-btn-dark" style={{ background: '#2ecc71', color: 'white', borderColor: '#2ecc71' }} onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
                <button className="edit-btn-dark" style={{ background: '#e74c3c', color: 'white', borderColor: '#e74c3c' }} onClick={handleCancel}>
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <button className="edit-btn-dark" onClick={() => setIsEditing(true)}>
                <Edit size={16} /> Edit
              </button>
            )}
          </div>
        )}

        <span className="section-label">Contact Me</span>
        <div className="section-label-line" />
        <h2 className="section-title-serif">Let's Work<br />Together</h2>
        <p className="contact-desc">
          I'm currently available to take on new projects. Let's build something amazing together!
        </p>

        <div className="contact-items">
          <div className="contact-item">
            <div className="contact-item__icon">
              <Mail size={20} />
            </div>
            <div>
              <p className="contact-item__label">Email</p>
              {isEditing ? (
                <input 
                  className="edit-input-small" 
                  value={editContent.email} 
                  onChange={e => setEditContent({...editContent, email: e.target.value})} 
                />
              ) : (
                <p className="contact-item__value">{content.email}</p>
              )}
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item__icon">
              <Phone size={20} />
            </div>
            <div>
              <p className="contact-item__label">Phone</p>
              {isEditing ? (
                <input 
                  className="edit-input-small" 
                  value={editContent.phone} 
                  onChange={e => setEditContent({...editContent, phone: e.target.value})} 
                />
              ) : (
                <p className="contact-item__value">{content.phone}</p>
              )}
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item__icon">
              <MapPin size={20} />
            </div>
            <div>
              <p className="contact-item__label">Location</p>
              {isEditing ? (
                <input 
                  className="edit-input-small" 
                  value={editContent.location} 
                  onChange={e => setEditContent({...editContent, location: e.target.value})} 
                />
              ) : (
                <p className="contact-item__value">{content.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="contact-form-wrap animate-fade-in-right reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Your Email</label>
              <input type="email" className="form-input" placeholder="john@example.com" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input type="text" className="form-input" placeholder="Project Inquiry" required />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" placeholder="Tell me about your project..." rows={5} required />
          </div>
          <button type="submit" className="btn-coral">
            Send Message <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
