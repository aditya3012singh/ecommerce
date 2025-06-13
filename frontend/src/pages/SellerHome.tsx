import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  {
    id: "create-account",
    label: "Create Account",
    content: `Creating your seller account is a quick and easy process. All you need are three documents:
    
1. GSTIN (Goods and Services Tax Identification Number)
2. Bank Account Details
3. A Government ID for verification

Once you register, you gain access to our seller portal where you can list products, manage inventory, and track orders.`,
  },
  {
    id: "storage-shipping",
    label: "Storage & Shipping",
    content: `You have two options for handling inventory:

• Store and ship products yourself  
• Use our Fulfillment services where we store, pack, and deliver your products

This ensures fast and reliable shipping, increasing your chances of winning the 'Flipkart Assured' badge.`,
  },
  {
    id: "receive-payments",
    label: "Receive Payments",
    content: `We ensure timely and secure payments directly to your registered bank account.

• Payments are made every 7 days  
• Transparent reports and invoices available in your dashboard  
• No hidden charges or delays

Sell with confidence knowing your earnings are protected.`,
  },
  {
    id: "seller-app",
    label: "Seller App",
    content: `Manage your business on the go with our Seller Hub App.

• Track orders in real time  
• Update listings and pricing  
• Get instant updates on returns, cancellations, and payouts

The app keeps your business running 24/7 from anywhere.`,
  },
  {
    id: "help-support",
    label: "Help & Support",
    content: `Our dedicated seller support team is always ready to help:

• 24/7 Chat and Call Support  
• Dedicated Account Managers  
• Access to Seller University and FAQs

Grow your business with continuous guidance.`,
  },
];

export const SellerHome = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("create-account");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const ref = sectionRefs.current[section.id];
      if (ref) observer.observe(ref);
    });

    return () => {
      sections.forEach((section) => {
        const ref = sectionRefs.current[section.id];
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="pl-8 pt-2 pb-2 text-sm border-b-2 text-slate-500">
        Existing Seller? Explore our product recommendations with Dhamaka Selection
      </div>

      {/* Navigation Bar */}
      <nav className="">
        <div className="flex justify-between items-center h-16 relative">
          {/* Left - Logo and Dropdowns */}
          <div className="flex items-center space-x-6 pl-8">
            <div className="font-bold text-xl">ecommerce</div>
            {["Sell Online", "Fees and Commission", "Grow", "Learn"].map((label) => (
              <div key={label} className="relative group">
                <button className="text-lg text-slate-600 font-serif px-2 py-1">{label}</button>
                <div className="absolute top-full left-0 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-150 bg-white shadow-md border rounded-md z-50 min-w-56">
                  <ul className="py-2 px-6 text-base text-gray-700 space-y-2">
                    <li><a href="#" className="block hover:text-blue-600 cursor-pointer">Option 1</a></li>
                    <li><a href="#" className="block hover:text-blue-600 cursor-pointer">Option 2</a></li>
                    <li><a href="#" className="block hover:text-blue-600 cursor-pointer">Option 3</a></li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Auth Buttons */}
          <div className="h-full flex items-center space-x-4 px-6">
            <button className="text-lg text-slate-800 font-medium" onClick={() => navigate("/signinSeller")}>Login</button>
            <button className="text-white font-semibold text-lg h-full p-4 bg-yellow-500" onClick={() => navigate("/signupSeller")}>
              Start Selling
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white w-full">
        <div className="text-md pl-8 text-gray-500">Home &gt; Sell Online</div>
        <div className="flex justify-center items-center gap-8 px-4 ">
          {/* Text Section */}
          <div className="max-w-md">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="text-4xl pt-4 font-serif text-gray-600"
            >
              Sell Online with Us...
            </motion.div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center items-center">
            <img
              src="https://as2.ftcdn.net/v2/jpg/07/02/88/19/1000_F_702881940_nYvDp2BjTD7SSiQLF9OVwQxXmh4zcMC2.jpg"
              alt="Business Owners"
              className="h-96 max-w-3xl object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex justify-center">
          <div className="flex justify-between gap-6 px-10 py-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-6xl w-full divide-x divide-gray-200">
            {[
              ["👥", "Trusted Customers"],
              ["💳", "7* days secure & regular payments"],
              ["💰", "Low cost of doing business"],
              ["📞", "One click Seller Support"],
              ["🛍️", "24*7 Customer Care"],
            ].map(([icon, label]) => (
              <div key={label} className="flex-1 text-center px-4">
                <div className="text-blue-500 text-2xl mb-1">{icon}</div>
                <div className="font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body with Sidebar + Sections */}
      <div className="px-10 pt-8">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 sticky top-0 h-screen">
          <ul className="space-y-4">
            {sections.map((section) => (
              <li
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`cursor-pointer px-3 py-2 rounded transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-600 font-semibold border border-blue-600"
                    : "hover:text-blue-600"
                }`}
              >
                {section.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-20 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[section.id] = el;
              }}
              className="scroll-mt-24"
            >
              <h2 className="text-3xl font-bold mb-4">{section.label}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};
