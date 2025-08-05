// import React, { useState, useRef } from 'react';

// const defaultQuestion = () => ({
//   question: '',
//   options: '',
//   answer: '',
//   minute: 0,
//   second: 0,
// });

// export default function QuizForm() {
//   const [questions, setQuestions] = useState([defaultQuestion()]);
//   const [previewSrc, setPreviewSrc] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
//   const aiBtnRef = useRef(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setPreviewSrc(URL.createObjectURL(file));
//   };

//   const handleAdd = (prefill) => {
//     setQuestions((q) => [...q, prefill || defaultQuestion()]);
//   };

//   const handleRemove = (idx) => {
//     setQuestions((q) => q.filter((_, i) => i !== idx));
//   };

//   const handleChange = (idx, field, value) => {
//     setQuestions((q) => {
//       const copy = [...q];
//       copy[idx][field] = value;
//       return copy;
//     });
//   };

//   const generateAI = async () => {
//     const btn = aiBtnRef.current;
//     btn.disabled = true;
//     btn.textContent = 'Đang tạo...';
//     try {
//       const res = await fetch('/api/ai/generate-quiz', { method: 'POST' });
//       const data = await res.json(); // expect array of { question, options, answer, time }
//       const mapped = data.map((item) => ({
//         question: item.question || '',
//         options: (item.options || []).join(';'),
//         answer: item.answer || '',
//         minute: item.time?.[0] || 0,
//         second: item.time?.[1] || 0,
//       }));
//       setQuestions(mapped);
//     } catch (err) {
//       alert('Tạo AI thất bại');
//     } finally {
//       btn.disabled = false;
//       btn.textContent = '🤖 Tạo tự động (AI)';
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // xử lý submit
//     console.log({ questions });
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
//       <div className="bg-blue-600 px-6 py-4">
//         <h1 className="text-2xl font-semibold text-white">Tạo Quiz Cho Video</h1>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Upload Video</label>
//             <input
//               type="file"
//               accept="video/*"
//               onChange={handleFileChange}
//               className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Xem trước</label>
//             <div className="mt-1 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
//               <video src={previewSrc} controls className="w-full" />
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-gray-800">Quiz Items</h2>
//           <div className="space-x-4">
//             <button
//               type="button"
//               onClick={() => handleAdd()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//               + Thêm câu hỏi
//             </button>
//             <button
//               type="button"
//               ref={aiBtnRef}
//               onClick={generateAI}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
//               🤖 Tạo tự động (AI)
//             </button>
//           </div>
//         </div>
//         <div className="space-y-6">
//           {questions.map((q, idx) => (
//             <div key={idx} className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
//               {questions.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => handleRemove(idx)}
//                   className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//                   ✕
//                 </button>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Câu hỏi #{idx+1}</label>
//                   <textarea
//                     rows={2}
//                     value={q.question}
//                     onChange={(e) => handleChange(idx, 'question', e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
//                     placeholder="Nhập câu hỏi..." />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phương án (ngăn cách `;`)</label>
//                   <input
//                     type="text"
//                     value={q.options}
//                     onChange={(e) => handleChange(idx, 'options', e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200"
//                     placeholder="Ví dụ: A;B;C;D" />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Đáp án đúng</label>
//                     <select
//                       value={q.answer}
//                       onChange={(e) => handleChange(idx, 'answer', e.target.value)}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-200">
//                       <option value="">— Chọn đáp án —</option>
//                       {q.options.split(';').map((opt, i) => (
//                         <option key={i} value={opt.trim()}>{opt.trim()}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Hiển thị lúc (mm:ss)</label>
//                     <div className="mt-1 flex space-x-3 items-center">
//                       <input
//                         type="number"
//                         min={0}
//                         value={q.minute}
//                         onChange={(e) => handleChange(idx, 'minute', parseInt(e.target.value))}
//                         className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right focus:ring-2 focus:ring-blue-200"
//                         placeholder="Phút" />
//                       <input
//                         type="number"
//                         min={0}
//                         max={59}
//                         value={q.second}
//                         onChange={(e) => handleChange(idx, 'second', parseInt(e.target.value))}
//                         className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right focus:ring-2 focus:ring-blue-200"
//                         placeholder="Giây" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="pt-4 border-t">
//           <button
//             type="submit"
//             className="w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition">
//             Lưu Quiz
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/pages/DemoPage.tsx
"use client";
import React from "react";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";

const DemoPage: React.FC = () => {


  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <div></div>
    </BaseScreenAdmin>
  );
};

export default DemoPage;
