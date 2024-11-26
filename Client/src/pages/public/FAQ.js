import React, { useState } from 'react';

const FAQ = () => {
  const [selectedTopic, setSelectedTopic] = useState('about');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Các mục bên trái với danh sách câu hỏi và nội dung trả lời
  const topics = [
    { 
      id: 'about', 
      title: 'Common Information', 
      questions: [
        { 
          q: 'Who are we?', 
          a: 'VIEEN\'s Store is dedicated to providing quality products with excellent customer service. Our team is passionate about offering the best to our customers.' 
        },
        { 
          q: 'Our Policy', 
          a: 'VIEEN\'s Store is dedicated to providing quality products with excellent customer service. Our team is passionate about offering the best to our customers.' 
        },
        { 
          q: 'Account is Locked', 
          a: 'VIEEN\'s Store is dedicated to providing quality products with excellent customer service. Our team is passionate about offering the best to our customers.' 
        },
        { 
          q: 'Change Password', 
          a: 'VIEEN\'s Store is dedicated to providing quality products with excellent customer service. Our team is passionate about offering the best to our customers.' 
        },
        { 
          q: 'How to contact Customer Care, Hotline, Call Center?', 
          a: 'We prioritize customer satisfaction and strive to bring unique products at affordable prices.' 
        }
      ]
    },
    { 
      id: 'shipping', 
      title: 'Shipping & Delivery', 
      questions: [
        { 
          q: 'Can I cancel my order?', 
          a: 'We offer standard and express shipping options. Delivery times may vary depending on your location.' 
        },
        { 
          q: 'How to track the shipping status of an order?', 
          a: 'Yes, you can track your order using the tracking link provided in your confirmation email.' 
        },
        { 
          q: 'Can I delete/edit my product review?', 
          a: 'Yes, you can track your order using the tracking link provided in your confirmation email.' 
        },
        { 
          q: 'How are shipping fees calculated?', 
          a: 'Yes, you can track your order using the tracking link provided in your confirmation email.' 
        }
      ]
    },
    
    { 
      id: 'payment', 
      title: 'Payment', 
      questions: [
        { 
          q: 'What payment methods are accepted?', 
          a: 'We accept major credit cards, PayPal, and bank transfers.' 
        },
        { 
          q: 'Is my payment information secure?', 
          a: 'Yes, all transactions are encrypted and secure.' 
        }
      ]
    },
    { 
      id: 'support', 
      title: 'Customer Support', 
      questions: [
        { 
          q: 'How can I contact support?', 
          a: 'You can contact us via email at support@vieensstore.com or through our live chat on the website.' 
        },
        { 
          q: 'What are the support hours?', 
          a: 'Our support team is available 24/7.' 
        }
      ]
    }
  ];

  const filteredTopics = searchTerm
    ? topics.map((topic) => ({
        ...topic,
        questions: topic.questions.filter((question) =>
          question.q.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(topic => topic.questions.length > 0)
    : topics;

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex flex-col py-4 text-center bg-[#c9e1d2] rounded-xl shadow-md'>
        <h1 className='font-semibold text-[32px]'>VIEEN'S STORE HELP CENTER</h1>
        <p className='font-light text-[24px]'>How can we help you?</p>
        <div className='my-4 w-[600px] mx-auto'>
        <input
          type='text'
          placeholder='Search for a question...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-3 rounded-lg border border-gray-300 shadow-sm'
        />
      </div>
      </div>



      <div className='flex my-6 gap-6'>
        {/* Mục bên trái */}
        <div className='w-[30%] h-fit border p-4 rounded-[16px] shadow-md'>
          <ul className='space-y-3'>
            {topics.map((topic) => (
              <li
                key={topic.id}
                className={`p-3 cursor-pointer rounded-lg ${
                  selectedTopic === topic.id ? 'bg-[#c9e1d2] text-main' : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                {topic.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Nội dung chi tiết bên phải */}
        <div className='w-[70%] h-fit bg-white p-8 rounded-lg shadow-md'>
          <h2 className='text-[28px] font-semibold mb-4 text-[#345B63]'>
            {searchTerm ? 'Search Results' : topics.find((topic) => topic.id === selectedTopic)?.title}
          </h2>
          <div className='space-y-4'>
            {(searchTerm ? filteredTopics : [topics.find(topic => topic.id === selectedTopic)])
              .map((topic) =>
                topic.questions.map((question, index) => (
                  <div key={index} className='border-b border-gray-200 pb-3'>
                    <button
                      className='text-[18px] font-medium w-full text-left focus:outline-none'
                      onClick={() => setOpenQuestion(openQuestion === question.q ? null : question.q)}
                    >
                      {question.q}
                    </button>
                    {openQuestion === question.q && (
                      <p className='text-[16px] text-gray-700 mt-2'>{question.a}</p>
                    )}
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
