"use client";

import React, { useState } from 'react';

const CreateCampaign: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [desiredAmount, setDesiredAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, emoji, desiredAmount });
    // Handle form submission, e.g., send data to the backend
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="card  shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create a New Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Campaign Name" 
              className="input input-bordered w-full" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea 
              placeholder="Campaign Description" 
              className="textarea textarea-bordered w-full" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Emoji (Symbol)</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., 🎉" 
              className="input input-bordered w-full" 
              value={emoji} 
              onChange={(e) => setEmoji(e.target.value)} 
              required 
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Desired Amount</span>
            </label>
            <input 
              type="number" 
              placeholder="Desired Amount" 
              className="input input-bordered w-full" 
              value={desiredAmount} 
              onChange={(e) => setDesiredAmount(e.target.value)} 
              required 
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">Create Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;