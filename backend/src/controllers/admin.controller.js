const db = require('../db/db.service');

// Get Organization Admin Profile (GET /api/admin/profile)
const getAdminProfile = async (req, res, next) => {
  try {
    const orgProfile = await db.getOrganizationProfile(req.user.id);
    if (!orgProfile) {
      return res.status(404).json({ success: false, message: 'Organization profile not found.' });
    }

    res.status(200).json({
      success: true,
      profile: orgProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get Organization Aggregate Analytics (GET /api/admin/stats)
const getAdminStats = async (req, res, next) => {
  try {
    const analytics = await db.getAdminAnalytics();

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminProfile,
  getAdminStats
};
