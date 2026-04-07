import sendEmail from '../utils/email.js';
import Item from '../models/Item.js';
import User from '../models/user.model.js';

export const contactOwner = async (req, res) => {
  try {
    // Phase 3: Get itemId, message, and sender
    const itemId = req.params.id || req.params.itemId; // Try both just in case routes differ
    const { message } = req.body;
    const sender = req.user; // This will come from auth middleware later

    // Validate that required fields exist
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!sender) {
      return res.status(401).json({ success: false, message: 'Unauthorized. No user found.' });
    }

    // Phase 4: Integration - Fetch Item and Owner
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const owner = await User.findById(item.userId);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Item owner not found in database' });
    }

    const ownerEmail = owner.email;
    const itemName = item.name;

    const emailMessage = `
Hi there,

Good news! Someone has found your lost item: ${itemName}.

Finder Details:
Email: ${sender.email}
Phone: ${sender.phone || 'Not provided'}

Message from finder:
"${message}"

Please contact them directly to coordinate retrieving your item.

Best regards,
The College Lost & Found System
    `;

    // Send the email
    await sendEmail({
      email: ownerEmail,
      subject: `[Lost & Found] Someone found your item: ${itemName}!`,
      message: emailMessage
    });

    res.status(200).json({
      success: true,
      message: 'Contact email successfully sent to the owner!'
    });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contact email. Please try again later.'
    });
  }
};
