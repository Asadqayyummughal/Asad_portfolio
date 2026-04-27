import { useState, useEffect } from 'react';
import './ContactSection.css';
import { Mail, Phone, MapPin, Send, Edit, Save, X } from 'lucide-react';
import { useFirebaseContent } from '../contexts/FirebaseContentContext';

const ContactSection = () => {
  const { content: globalContent, updateContent, submitContact } = useFirebaseContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultContact = {
    email: 'hello@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA'
  };
  
  const content = { ...defaultContact, ...(globalContent.contact || {}) };
  const [editContent, setEditContent] = useState(content);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await submitContact(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
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
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Project Inquiry" 
              required 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea 
              className="form-textarea" 
              placeholder="Tell me about your project..." 
              rows={5} 
              required 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-coral" disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Sending...' : (
              <>Send Message <Send size={16} /></>
            )}
          </button>
          {formStatus === 'success' && (
            <p className="form-success-message">Message sent successfully! I'll get back to you soon.</p>
          )}
          {formStatus === 'error' && (
            <p className="form-error-message">Failed to send message. Please try again later.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
