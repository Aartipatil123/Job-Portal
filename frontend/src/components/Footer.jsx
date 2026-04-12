import React from 'react';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {}
        <div>
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-400">
            We provide the latest job opportunities for professionals across multiple industries. Join us and discover your next big career move.
          </p>
        </div>
        {}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        {}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <ul className="space-y-2">
            <li><a href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-white">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-white">LinkedIn</a></li>
            <li><a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-white">Instagram</a></li>
          </ul>
        </div>
        {}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Subscribe</h2>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter to get the latest job openings and career tips directly in your inbox.
          </p>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 w-full rounded bg-gray-700 text-white mb-2"
            />
            <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {}
      <div className="text-center text-gray-500 mt-10">
        <p>&copy; 2024 Job Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
