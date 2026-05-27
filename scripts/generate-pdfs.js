const fs = require('fs');
const path = require('path');

// Create a simple text-to-PDF converter using html2pdf
const html2pdf = require('html2pdf.js');

// SOP 1 - Computer Science
const sop1HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 8.5in; margin: 0; padding: 40px; }
    h1 { color: #1f2937; border-bottom: 3px solid #f97316; padding-bottom: 10px; }
    .section { margin-top: 20px; }
    p { text-align: justify; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>Statement of Purpose</h1>
  <p><strong>Name:</strong> Priya Sharma</p>
  <p><strong>Program:</strong> Master of Science in Computer Science</p>
  <p><strong>Target University:</strong> Massachusetts Institute of Technology (MIT)</p>
  
  <div class="section">
    <h2>Academic Background</h2>
    <p>I am writing to express my strong interest in pursuing a Master's degree in Computer Science at MIT. With a B.Tech in Computer Science from Delhi University (CGPA: 3.85/4.0) and three years of professional experience as a Software Engineer at TCS, I am confident that MIT's rigorous curriculum and cutting-edge research opportunities align perfectly with my career aspirations.</p>
  </div>

  <div class="section">
    <h2>Academic Achievements</h2>
    <p>Throughout my undergraduate studies, I consistently maintained a strong GPA and excelled in core computer science courses including Data Structures, Algorithms, Database Systems, and Operating Systems. I also secured a score of 8.5/9.0 in the IELTS examination and 333/340 in the GRE (Quantitative: 169/170), demonstrating my proficiency in English and analytical abilities.</p>
  </div>

  <div class="section">
    <h2>Professional Experience</h2>
    <p>At Tata Consultancy Services (TCS), I worked as a Senior Software Engineer developing enterprise-level applications using Java, Python, and cloud technologies. I led the development of a real-time data processing system that reduced latency by 40%, and mentored junior developers on software architecture best practices.</p>
  </div>

  <div class="section">
    <h2>Research Interests</h2>
    <p>My primary research interests lie in Artificial Intelligence, Machine Learning, and Distributed Systems. I am particularly passionate about applying deep learning techniques to solve real-world problems in healthcare and finance. MIT's renowned AI Lab and collaborations with industry leaders make it the ideal environment for my research pursuits.</p>
  </div>

  <div class="section">
    <h2>Career Goals</h2>
    <p>After completing my Master's degree, I aspire to work at a leading technology company like Google or Microsoft, where I can contribute to innovative projects in AI and cloud computing. In the long term, I aim to establish my own research institute focused on making AI accessible to developing nations.</p>
  </div>

  <div class="section">
    <h2>Why MIT?</h2>
    <p>MIT's exceptional faculty, cutting-edge research facilities, and collaborative culture make it the perfect choice for my graduate studies. The opportunity to work with renowned professors and engage with peers from around the world will significantly enhance my technical expertise and broaden my global perspective.</p>
  </div>
</body>
</html>
`;

console.log("PDFs would be generated from this HTML template");
