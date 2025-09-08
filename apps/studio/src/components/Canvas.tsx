import React from 'react';

const Canvas: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Drag agents here</h3>
        <p className="text-gray-600">Start building your agent flow by dragging agents from the library</p>
      </div>
    </div>
  );
};

export default Canvas;
