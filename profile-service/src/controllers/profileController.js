const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');

// Create or update profile (protected)
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { bio, location, website, social } = req.body;
    const profileFields = {
      userId: req.user.id,
      bio,
      location,
      website,
      social
    };
    let profile = await Profile.findOne({ userId: req.user.id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ message: 'Profile updated', profile });
    }
    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json({ message: 'Profile created', profile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get profile data (protected)
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
}; 