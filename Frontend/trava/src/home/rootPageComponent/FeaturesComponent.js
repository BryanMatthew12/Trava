import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMoneyBillWave, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const FeaturesSection = () => {
  return (
    <div className="mt-16 w-[85%] text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Features to replace all your other tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-3xl sm:text-4xl mb-4" />
          <h3 className="font-bold text-base sm:text-lg">Add places from guides with 1 click</h3>
           <p className="text-gray-600 text-xs sm:text-sm">
            We crawled the web so you don’t have to. Easily add mentioned places to your plan.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-3xl sm:text-4xl mb-4" />
          <h3 className="font-bold text-base sm:text-lg">Expense tracking and splitting</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Keep track of your budget and split the cost between your tripmates.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faUsers} className="text-purple-500 text-3xl sm:text-4xl mb-4" />
          <h3 className="font-bold text-base sm:text-lg">Collaborate with friends in real time</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Plan along with your friends with live syncing and collaborative editing.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faClipboardList} className="text-orange-500 text-3xl sm:text-4xl mb-4" />
          <h3 className="font-bold text-base sm:text-lg">Checklists for anything</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Stay organized with a packing list, to-do list, shopping list, any kind of list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;