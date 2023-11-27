import React, { useState } from 'react'
import Utils from '../controller/Utils'

function ItemForm() {
  const authorized = Utils.useRoleCheck('Lost and Found Staff');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleNewItem = () => {
    
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  }

  if(!authorized){
    return (
      <h1 className='flex flex-row justify-center text-2xl font-bold mt-4'>You are not authorized.</h1>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Update Lost and Found Log</h2>
      <form onSubmit={handleNewItem}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-600">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="mt-1 p-2 w-full border rounded-md"
            accept="image/*"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Submit Item
        </button>
      </form>
    </div>
  )
}

export default ItemForm
