
import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold dark:text-white mb-4">NagrikAi</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Making Indian law simple and accessible for everyone. 
              Knowledge of your rights is the first step toward justice.
            </p>
          </div>
          <div>
            <h4 className="font-semibold dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-blue-600">Home</button></li>
              <li><button onClick={() => onNavigate('categories')} className="hover:text-blue-600">Law Categories</button></li>
              <li><button onClick={() => onNavigate('guides')} className="hover:text-blue-600">Action Guides</button></li>
              <li><button onClick={() => onNavigate('disclaimer')} className="hover:text-blue-600">Disclaimer</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold dark:text-white mb-4">Emergency</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Police: <span className="font-bold text-red-500">100 / 112</span></li>
              <li>Women Helpline: <span className="font-bold text-red-500">1091</span></li>
              <li>Child Helpline: <span className="font-bold text-red-500">1098</span></li>
              <li>Cyber Crime: <span className="font-bold text-red-500">1930</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t dark:border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NagrikAi. Built with ❤️ for Bharat.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
