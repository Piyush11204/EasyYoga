import React, { useState } from 'react';
import axios from 'axios';

const AddLocation = ({ onAddLocation }) => {
    const [formData, setFormData] = useState({
        name: '',
        locationType: '',
        station: '',
        image: null,
        description: '',
        additionalDetails: '',
        rating: 0,
    });

    const stations = [
        'Churchgate', 'Mumbai CST', 'Dadar', 'Lokmanya Tilak', 'Andheri', 'Borivali', 
        'Kalyan', 'Thane', 'Mumbai LTT', 'Mumbai Dadar', 'Mumbai Bandra', 'Mumbai Kurla', 
        'Mumbai Vile Parle', 'Boisar', 'Palghar', 'Kelve Road', 'Virar', 'Vasai Road',
    ];

    const locationTypes = ['Park', 'Beach', 'Forest', 'Temple', 'Mountain', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleRating = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('locationType', formData.locationType);
        data.append('station', formData.station);
        data.append('image', formData.image);
        data.append('description', formData.description);
        data.append('additionalDetails', formData.additionalDetails);
        data.append('rating', formData.rating);

        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8080/api/addlocation',
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Location added successfully:', response.data);
            // Call the function passed from Home
            onAddLocation(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen my-32 flex justify-center items-center">
            <div className="max-w-screen-lg w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Add Location</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Location Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Location Type:</label>
                        <select
                            name="locationType"
                            value={formData.locationType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="" disabled>Select type</option>
                            {locationTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nearby Station:</label>
                        <select
                            name="station"
                            value={formData.station}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="" disabled>Select station</option>
                            {stations.map((station, index) => (
                                <option key={index} value={station}>{station}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Image:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="4"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Additional Details:</label>
                        <input
                            type="text"
                            name="additionalDetails"
                            value={formData.additionalDetails}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Rating:</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-2xl cursor-pointer ${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                    onClick={() => handleRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-violet-500 text-white font-semibold rounded-lg shadow-lg hover:bg-violet-800 transition duration-300 ease-in-out"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLocation;
