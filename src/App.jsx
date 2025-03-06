import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import questionsData from './data/questions.json';

function App() {
  const [userQuestions, setUserQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const currentUrl = window.location.href;

  useEffect(() => {
    const savedQuestions = localStorage.getItem('userQuestions');
    const savedResponses = localStorage.getItem('userResponses');

    if (savedQuestions) {
      setUserQuestions(JSON.parse(savedQuestions));
      setResponses(JSON.parse(savedResponses) || {});
    } else {
      const allQuestions = questionsData.questions;
      const randomQuestions = [...allQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      setUserQuestions(randomQuestions);
      localStorage.setItem('userQuestions', JSON.stringify(randomQuestions));
    }
  }, []);

  const handleResponseChange = (questionId, response) => {
    const newResponses = {
      ...responses,
      [questionId]: response
    };
    setResponses(newResponses);
    localStorage.setItem('userResponses', JSON.stringify(newResponses));
  };

  if (userQuestions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary-600">
            Chris Fifties Challenge
          </h1>
          <p className="text-lg text-gray-700">
            Trouve les réponses à ces questions le plus rapidement possible et va voir Chris pour boire un shot avec lui !
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {userQuestions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {index + 1}. {question.text}
              </h2>
              <textarea
                className="input min-h-[100px] resize-none"
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Tapez votre réponse ici..."
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <p className="text-gray-600 italic text-center">
            N'oublie pas d'aller voir Chris une fois que tu as fini !
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-600">Partage ce challenge :</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
              <QRCodeSVG 
                value={currentUrl}
                size={150}
                level="L"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 