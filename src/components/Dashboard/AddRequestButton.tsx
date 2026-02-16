import React from 'react';
import { Plus } from 'lucide-react';
import './AddRequestButton.css';

const AddRequestButton: React.FC = () => {
  return (
    <button className="add-request-btn">
      <Plus size={18} strokeWidth={2.5} />
      <span>Add Request</span>
    </button>
  );
};

export default AddRequestButton;
