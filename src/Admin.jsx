import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import app from './firebase/Firebase'

const Admin = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase(app);
      const studentsRef = ref(db, 'students');
      
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        setLoading(false);
        if (data) {
          const studentsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setStudents(studentsArray);
        } else {
          setStudents([]);
        }
      });
    };
    

    fetchData()
  }, [])

  const handleDelete = async (studentId) => {
    setDeleting(studentId);
    const db = getDatabase(app);
    const studentRef = ref(db, `students/${studentId}`);
  

    try {
      await remove(studentRef);
      setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
      setError(null);
      console.log('Student deleted successfully');

      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again.');
    }
    finally {
      setDeleting(null);
    }
  };
  
  const handleShowMessage = (student) => {
    setSelectedStudent(student);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen"
    >
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center text-indigo-800 drop-shadow-lg">Admin Dashboard</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="overflow-x-auto bg-white shadow-2xl rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
              />
            </div>
          ) : students.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">ID</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Name</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Course</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-900">{student.id}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-900">{student.name}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">{student.email}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{student.phone}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-sm text-gray-900">{student.course}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                          onClick={() => handleShowMessage(student)}
                        >
                          Show Message
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                          onClick={() => handleDelete(student.id)}
                          disabled={deleting === student.id}
                        >
                          {deleting === student.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-t-2 border-white border-solid rounded-full"
                            />
                          ) : (
                            'Delete'
                          )}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">No data available in the database.</p>
            </div>
          )}
        </div>
        {selectedStudent && students.some(student => student.id === selectedStudent.id) && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Student Message</h2>
            <p className="text-gray-700">{selectedStudent.message || "No message available."}</p>
            <button 
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Admin