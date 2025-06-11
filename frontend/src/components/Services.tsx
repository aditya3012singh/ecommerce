import React from "react";
import AppBar from "./AppBar";

const Services = () => {
  return (
    <div className="bg-gradient-to-b from-black  via-emerald-950 to-black">
        <div className="fixed top-0 left-0 right-0 z-50">
        <AppBar type="Profile"/>
        </div>
        <div></div>
        <div className="pt-5">
    
    <div className="min-h-screen bg-gradient-to-b from-black  via-emerald-950 to-black px-4 py-12">
        <div className="">
      <div className="max-w-6xl bg-black mx-auto rounded-xl shadow-lg p-6 md:p-10 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-white text-lg max-w-3xl mx-auto">
            Explore the range of services we’re developing to provide a seamless ecommerce experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">Product Listings</h2>
            <p className="text-gray-600">
              Browse and manage a wide variety of products with advanced search and category filters.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">User Authentication</h2>
            <p className="text-gray-600">
              Secure login and signup using modern auth practices, allowing a personalized shopping experience.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">Shopping Cart</h2>
            <p className="text-gray-600">
              Add items to your cart, update quantities, and manage orders easily in one place.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">Admin Dashboard</h2>
            <p className="text-gray-600">
              Manage products, view user activity, and analyze sales through a simple admin interface.
            </p>
          </div>

          {/* Service 5 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">Responsive UI</h2>
            <p className="text-gray-600">
              Optimized layout for desktop and mobile devices with a fast, clean experience using Tailwind CSS.
            </p>
          </div>

          {/* Service 6 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800">Future Integrations</h2>
            <p className="text-gray-600">
              Payment gateways, order tracking, and notifications are planned for upcoming versions.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-zinc-800">More Coming Soon</h2>
          <p className="text-gray-700 mb-4">
            We’re constantly adding new features — stay tuned for updates!
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Get in Touch
          </a>
          </div>
        </div></div>
      </div>
    </div></div>
  );
};

export default Services;
