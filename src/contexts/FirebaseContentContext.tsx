import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllContent, updateContentSection, submitContactForm, getAllTestimonials, addTestimonial } from '../utils/firebase';

type ContentType = {
  hero?: { eyebrow: string; headline: string; sub: string; roleTitle: string; name: string };
  about?: { text: string };
  contact?: { email: string; phone: string; location: string };
  experience?: Array<{ id: number; role: string; company: string; period: string; description: string; technologies: string[] }>;
  projects?: Array<{ id: number; title: string; description: string; image: string; tags: string[]; links: { live: string; github: string } }>;
  [key: string]: any;
};

interface ContentContextType {
  content: ContentType;
  testimonials: any[];
  updateContent: (section: string, data: any) => Promise<void>;
  submitContact: (data: any) => Promise<boolean>;
  addTestimonial: (testimonial: any) => Promise<boolean>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const FirebaseContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentType>({});
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentData, testimonialsData] = await Promise.all([
          getAllContent(),
          getAllTestimonials()
        ]);
        setContent(contentData || {});
        setTestimonials(testimonialsData || []);
      } catch (error) {
        console.error('Failed to load data from Firebase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateContent = async (section: string, data: any) => {
    try {
      const isArraySection = Array.isArray(data);
      const newSectionData = isArraySection ? data : { ...content[section], ...data };
      
      // Optimistic update
      setContent(prev => ({ ...prev, [section]: newSectionData }));

      await updateContentSection(section, newSectionData);
    } catch (error) {
      console.error('Failed to save content to Firebase:', error);
      throw error;
    }
  };

  const submitContact = async (data: any) => {
    try {
      return await submitContactForm(data);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      throw error;
    }
  };

  const addNewTestimonial = async (testimonial: any) => {
    try {
      const result = await addTestimonial(testimonial);
      if (result) {
        const updatedTestimonials = await getAllTestimonials();
        setTestimonials(updatedTestimonials);
      }
      return result;
    } catch (error) {
      console.error('Failed to add testimonial:', error);
      throw error;
    }
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      testimonials, 
      updateContent, 
      submitContact,
      addTestimonial: addNewTestimonial,
      isLoading 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useFirebaseContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useFirebaseContent must be used within a FirebaseContentProvider');
  }
  return context;
};
