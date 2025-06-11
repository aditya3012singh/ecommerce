import React from "react";
import AppBar from "./AppBar";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-black  via-emerald-950 to-black">
        <div className="fixed top-0 left-0 right-0 z-50">
        <AppBar type="Profile"/>
        </div>
    <div className="min-h-screen  px-4 py-12">
      <div className="max-w-5xl mx-auto  rounded-xl shadow-lg p-6 md:p-10 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 pt-5">About Us</h1>
          <p className="text-white text-lg max-w-3xl mx-auto">
            Welcome to <strong>ecommerce</strong> – a project built out of passion and learning by two dedicated developers.
          </p>
        </div>

        {/* Mission */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-white">Our Mission</h2>
          <p className="text-white text-lg">
            Our goal is to create a clean, modern, and efficient ecommerce platform from scratch — applying full-stack development skills while continuously improving through hands-on experience.
          </p>
        </div>

        {/* Journey */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-white">Our Journey</h2>
          <ul className="space-y-4 border-l-2 border-blue-400 pl-4">
            <li className="text-white">
              <span className="font-bold text-blue-500">May 2025:</span > Started the project as a practice and learning initiative.
            </li>
            <li className="text-white">
              <span className="font-bold text-blue-500">June 2025:</span> Developed authentication, product listing, and UI components.
            </li>
            <li className="text-white">
              <span className="font-bold text-blue-500">Next Steps:</span> Payment integration, advanced filtering, and deployment.
            </li>
          </ul>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-zinc-800 text-center">Meet the Developers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-200 mb-3" />
              <h3 className="text-lg font-bold text-zinc-800">Aditya</h3>
              <p className="text-gray-600">Fullstack Developer (Backend & Frontend)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-purple-200 mb-3" />
              <h3 className="text-lg font-bold text-zinc-800">Aviral Madhvan</h3>
              <p className="text-gray-600">Frontend Developer</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-zinc-800">Follow Our Progress</h2>
          <p className="text-gray-700 mb-4">We’re constantly learning and building — your feedback means a lot!</p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div></div>
  );
};

export default About;
