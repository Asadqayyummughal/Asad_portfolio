// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDv08O0IyDVpa7kJHnKmaMMmrnEdKpORbI",
  authDomain: "asad-portfolio-da4eb.firebaseapp.com",
  projectId: "asad-portfolio-da4eb",
  storageBucket: "asad-portfolio-da4eb.firebasestorage.app",
  messagingSenderId: "982585205729",
  appId: "1:982585205729:web:95a5ee899d9ffafe7da8a0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Content collection reference
const contentCollection = collection(db, 'content');

// Get all content
export const getAllContent = async () => {
  try {
    const snapshot = await getDocs(contentCollection);
    const content: any = {};
    snapshot.forEach((doc) => {
      content[doc.id] = doc.data();
    });
    return content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

// Get specific section content
export const getContentSection = async (section: string) => {
  try {
    const docRef = doc(db, 'content', section);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching section:', error);
    throw error;
  }
};

// Update content section
export const updateContentSection = async (section: string, data: any) => {
  try {
    const docRef = doc(db, 'content', section);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

// Testimonials collection
const testimonialsCollection = collection(db, 'testimonials');

// Get all testimonials
export const getAllTestimonials = async () => {
  try {
    const snapshot = await getDocs(testimonialsCollection);
    const testimonials: any[] = [];
    snapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() });
    });
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

// Add testimonial
export const addTestimonial = async (testimonial: any) => {
  try {
    const docRef = doc(testimonialsCollection);
    await setDoc(docRef, testimonial);
    return true;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

// Contact form submissions collection
const contactSubmissionsCollection = collection(db, 'contact_submissions');

// Submit contact form
export const submitContactForm = async (data: any) => {
  try {
    const docRef = doc(contactSubmissionsCollection);
    await setDoc(docRef, {
      ...data,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export { db };
