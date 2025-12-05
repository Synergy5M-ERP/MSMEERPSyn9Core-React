import React, { useState } from 'react';
import { Home, User, MapPin, Info, BookOpen, GraduationCap, Building } from 'lucide-react';

const steps = [
  { id: 1, title: 'Personal Information', icon: User, key: 'personal' },
  { id: 2, title: 'Address Information', icon: MapPin, key: 'address' },
  { id: 3, title: 'Other Information', icon: Info, key: 'other' },
  { id: 4, title: 'Current Course', icon: BookOpen, key: 'course' },
  { id: 5, title: 'Past Qualification', icon: GraduationCap, key: 'qualification' },
  { id: 6, title: 'Hostel Details', icon: Building, key: 'hostel' }
];

const StepIndicator = ({ steps, currentStep, onStepClick, completedSteps }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Profile Completeness</span>
        <span className="text-sm font-bold text-white bg-green-500 px-3 py-1 rounded">
          {Math.round((completedSteps / steps.length) * 100)}%
        </span>
      </div>
      
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 z-0">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick(step.id)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : isCurrent
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border-4 border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon size={28} />
                </button>
                <div className="mt-3 text-center max-w-[100px]">
                  <div className={`text-xs font-semibold ${
                    isCurrent ? 'text-orange-500' : isCompleted ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PersonalInformation = ({ onNext }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
        <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
    </div>
    <div className="flex justify-end mt-8">
      <button onClick={onNext} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
        Next
      </button>
    </div>
  </div>
);

const AddressInformation = ({ onNext, onPrev }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Information</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button onClick={onPrev} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
        Previous
      </button>
      <button onClick={onNext} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
        Next
      </button>
    </div>
  </div>
);

const OtherInformation = ({ onNext, onPrev }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Other Information</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button onClick={onPrev} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
        Previous
      </button>
      <button onClick={onNext} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
        Next
      </button>
    </div>
  </div>
);

const CurrentCourse = ({ onNext, onPrev }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Course Details (AY 2025-2026)</h2>
    <p className="text-sm text-red-600 mb-6">All * marks fields are mandatory</p>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
          <option>Select Year</option>
          <option>First Year</option>
          <option>Second Year</option>
          <option>Third Year</option>
          <option>Fourth Year</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
          <option>Select Semester</option>
          <option>Semester 1</option>
          <option>Semester 2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date *</label>
        <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button onClick={onPrev} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
        Previous
      </button>
      <button onClick={onNext} className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
        Next
      </button>
    </div>
  </div>
);

const PastQualification = ({ onNext, onPrev }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Qualification</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Level *</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Select Level</option>
          <option>10th Standard</option>
          <option>12th Standard</option>
          <option>Diploma</option>
          <option>Bachelor's</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Board/University *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">School/College Name *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button onClick={onPrev} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
        Previous
      </button>
      <button onClick={onNext} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
        Next
      </button>
    </div>
  </div>
);

const HostelDetails = ({ onPrev, onSubmit }) => (
  <div className="bg-white rounded-lg shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Hostel Details</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Required?</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Select Option</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option>Select Type</option>
          <option>Single</option>
          <option>Double</option>
          <option>Triple</option>
        </select>
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button onClick={onPrev} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
        Previous
      </button>
      <button onClick={onSubmit} className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        Submit
      </button>
    </div>
  </div>
);

const Navbar = ({ onNavigate, currentPage }) => (
  <nav className="bg-blue-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => onNavigate('home')}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
            currentPage === 'home' ? 'bg-blue-700' : 'hover:bg-blue-800'
          }`}
        >
          <Home size={20} />
          <span className="font-medium">PP HOME</span>
        </button>
        <button 
          onClick={() => onNavigate('createEnquiry')}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 'createEnquiry' ? 'bg-blue-700' : 'hover:bg-blue-800'
          }`}
        >
          CREATE ENQUIRY
        </button>
        <button 
          onClick={() => onNavigate('quotation')}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 'quotation' ? 'bg-blue-700' : 'hover:bg-blue-800'
          }`}
        >
          QUOTATION ENTRY FORM
        </button>
        <button 
          onClick={() => onNavigate('priceComparison')}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 'priceComparison' ? 'bg-blue-700' : 'hover:bg-blue-800'
          }`}
        >
          PRICE COMPARISON
        </button>
        <button 
          onClick={() => onNavigate('selectSeller')}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 'selectSeller' ? 'bg-blue-700' : 'hover:bg-blue-800'
          }`}
        >
          SELECT SELLER
        </button>
      </div>
      <button 
        onClick={() => onNavigate('purchaseOrder')}
        className="bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors"
      >
        PURCHASE ORDER
      </button>
    </div>
  </nav>
);

// New Page Components
const CreateEnquiryPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Enquiry</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enquiry Type *</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>Select Type</option>
            <option>Product Enquiry</option>
            <option>Service Enquiry</option>
            <option>General Enquiry</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>Select Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Enquiry</button>
      </div>
    </div>
  </div>
);

const QuotationPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quotation Entry Form</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Number *</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount *</label>
          <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Quotation</button>
      </div>
    </div>
  </div>
);

const PriceComparisonPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Price Comparison</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border p-3 text-left">Item</th>
              <th className="border p-3 text-left">Vendor 1</th>
              <th className="border p-3 text-left">Vendor 2</th>
              <th className="border p-3 text-left">Vendor 3</th>
              <th className="border p-3 text-left">Best Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border p-3">Product A</td>
              <td className="border p-3">₹10,000</td>
              <td className="border p-3">₹9,500</td>
              <td className="border p-3">₹10,200</td>
              <td className="border p-3 bg-green-100 font-bold">₹9,500</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3">Product B</td>
              <td className="border p-3">₹15,000</td>
              <td className="border p-3">₹14,800</td>
              <td className="border p-3">₹15,500</td>
              <td className="border p-3 bg-green-100 font-bold">₹14,800</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Generate Report</button>
      </div>
    </div>
  </div>
);

const SelectSellerPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Seller</h1>
      <div className="space-y-4">
        {[1, 2, 3].map((seller) => (
          <div key={seller} className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Vendor {seller}</h3>
                <p className="text-gray-600">Rating: 4.{seller}/5</p>
                <p className="text-gray-600">Total Quote: ₹{25000 - seller * 1000}</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PurchaseOrderPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Purchase Order</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PO Number *</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Date *</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date *</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500">
            <option>30 Days</option>
            <option>60 Days</option>
            <option>90 Days</option>
            <option>Immediate</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500">Create Purchase Order</button>
      </div>
    </div>
  </div>
);

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPage, setCurrentPage] = useState('home');

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleSubmit = () => {
    alert('Form submitted successfully!');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <StepIndicator 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
              completedSteps={currentStep - 1}
            />
            {renderStepContent()}
          </div>
        );
      case 'createEnquiry':
        return <CreateEnquiryPage />;
      case 'quotation':
        return <QuotationPage />;
      case 'priceComparison':
        return <PriceComparisonPage />;
      case 'selectSeller':
        return <SelectSellerPage />;
      case 'purchaseOrder':
        return <PurchaseOrderPage />;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformation onNext={handleNext} />;
      case 2:
        return <AddressInformation onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <OtherInformation onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <CurrentCourse onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <PastQualification onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return <HostelDetails onPrev={handlePrev} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
          completedSteps={currentStep - 1}
        />
        {renderStepContent()}
      </div>
    </div>
  );
};

export default App;