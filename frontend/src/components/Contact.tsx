import React from "react";
import AppBar from "./AppBar";

const Contact = () => {
  return (
    <div className=" bg-gradient-to-b from-black  via-emerald-950 to-black">
    <div className="min-h-screen  ">
      <AppBar type="Profile"/>
      <div className="pt-24">
      <div className="max-w-4xl mx-auto bg-black   shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Contact Us
        </h2>

        <form className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-white">Full Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Subject</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Order Issue, Product Inquiry..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Message</label>
            <textarea
              rows={5}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center text-white text-sm">
          Or email us directly at <span className="text-indigo-600 font-semibold">support@yourstore.com</span>
        </div>
      </div>
      </div>
    </div></div>
  );
};

export default Contact;
