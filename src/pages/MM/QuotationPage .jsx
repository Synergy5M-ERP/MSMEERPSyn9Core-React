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