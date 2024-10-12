import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatabase, ref, set } from 'firebase/database';
import app from './firebase/Firebase';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import Admin from './Admin';

const ApplicationForm = ({ formData, handleChange, handleSubmit, isSubmitted, courses }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 relative">
    <AnimatePresence>
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded absolute top-4 left-1/2 transform -translate-x-1/2 z-10 shadow-md"
          role="alert"
        >
          <p className="font-bold">Success!</p>
          <p>Your application has been submitted successfully.</p>
        </motion.div>
      )}
    </AnimatePresence>
    <div className="w-full max-w-xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        IT Institute Application
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
            Course
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            placeholder="Enter your message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
);

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courses] = useState([
    'Website Development',
    'Graphic Designing',
    'Digital Marketing',
    'CCO'
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase(app);
      const newId = `IT${Math.floor(1000 + Math.random() * 9000)}`;
      const studentsRef = ref(db, `students/${newId}`);
      await set(studentsRef, {
        ...formData,
        id: newId
      });
      console.log('Form submitted:', { ...formData, id: newId });
      setIsSubmitted(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ApplicationForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitted={isSubmitted}
            courses={courses}
          />
        }
      />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<Admin />} />
    </Routes>
  );
}

export default App;
