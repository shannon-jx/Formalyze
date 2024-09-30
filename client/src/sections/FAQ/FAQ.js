import React from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Formalyze?",
      answer: "Formalyze is an AI-powered tool that helps you generate questions for forms based on your specified purpose. It also provides analysis of responses and data."
    },
    {
      question: "How does the AI question generation work?",
      answer: "Our AI analyzes the purpose you provide and generates relevant questions that suit your needs."
    },
    {
      question: "Is there a limit on the number of forms I can create?",
      answer: "Yes, the Basic Plan allows 10 forms per month, while the Pro Plan offers unlimited forms."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Absolutely! You can upgrade your plan at any time through your account settings."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer email support with all plans, and priority support for Pro and Enterprise users."
    },
  ];

  return (
    <div className="faq">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question">{item.question}</h2>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;