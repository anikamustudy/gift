import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../services';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
    privacySettings: {
      showProfile: true,
      showGiftsReceived: true,
      allowAnonymousGifts: true,
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user);
      setFormData({
        name: data.user.name,
        phone: data.user.phone,
        address: data.user.address,
        privacySettings: data.user.privacySettings,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else if (name.includes('privacySettings.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        privacySettings: { ...formData.privacySettings, [field]: checked },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card text-center">
            <div className="mb-4">
              <img
                src={profile?.profileImage || 'https://via.placeholder.com/150'}
                alt={profile?.name}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Membership:</span>
                <span className="font-semibold capitalize">
                  {profile?.membershipStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Love Impact Points:</span>
                <span className="font-semibold text-primary-600">
                  {profile?.loveImpactPoints}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-outline"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="privacySettings.showProfile"
                        checked={formData.privacySettings.showProfile}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Show my profile publicly</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="privacySettings.showGiftsReceived"
                        checked={formData.privacySettings.showGiftsReceived}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Show gifts I've received</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="privacySettings.allowAnonymousGifts"
                        checked={formData.privacySettings.allowAnonymousGifts}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Allow receiving anonymous gifts</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profile?.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    {profile?.address?.street}, {profile?.address?.city}
                    {profile?.address?.zipCode && ` - ${profile.address.zipCode}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Privacy Settings</p>
                  <div className="space-y-1 text-sm">
                    <p>• Profile visibility: {profile?.privacySettings?.showProfile ? 'Public' : 'Private'}</p>
                    <p>• Show gifts received: {profile?.privacySettings?.showGiftsReceived ? 'Yes' : 'No'}</p>
                    <p>• Anonymous gifts: {profile?.privacySettings?.allowAnonymousGifts ? 'Allowed' : 'Not allowed'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
