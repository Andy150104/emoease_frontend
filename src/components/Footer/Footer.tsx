import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Cột 1: Logo và mô tả */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-briefcase text-white text-2xl" />
            <span className="text-xl font-semibold text-white">Job</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Quis enim pellentesque viverra tellus eget malesuada facilisis.
            Congue nibh vivamus aliquet nunc mauris d...
          </p>
        </div>

        {/* Cột 2: Company */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Our Team</a>
            </li>
            <li>
              <a href="#">Partners</a>
            </li>
            <li>
              <a href="#">For Candidates</a>
            </li>
            <li>
              <a href="#">For Employers</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Job Categories */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Job Categories
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#">Telecommunications</a>
            </li>
            <li>
              <a href="#">Hotels & Tourism</a>
            </li>
            <li>
              <a href="#">Construction</a>
            </li>
            <li>
              <a href="#">Education</a>
            </li>
            <li>
              <a href="#">Financial Services</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">
            Eu nunc pretium vitae platea. Non netus elementum vulputate
          </p>
          <form>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full mb-4 p-3 rounded-md border border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition"
            >
              Subscribe now
            </button>
          </form>
        </div>
      </div>

      {/* Dưới cùng */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© Copyright Job Portal 2024. Designed by Figma.guru</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
