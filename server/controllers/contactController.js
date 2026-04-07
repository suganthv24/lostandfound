const sendEmail = require('../utils/email');

exports.contactOwner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { finderName, finderEmail, finderPhone, message } = req.body;

    // TODO: During Full Integration (Phase 1):
    // const item = await Item.findById(itemId).populate('creatorId');
    // if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    // const ownerEmail = item.creatorId.email;
    // const itemName = item.name;

    // --- MOCK DATA FOR TESTING API INDEPENDENTLY ---
    const ownerEmail = 'test@example.com'; // Replace with a real email to test
    const itemName = 'Lost Item (Placeholder)';
    // -----------------------------------------------

    const emailMessage = `
Hi there,

Good news! Someone has found your lost item: ${itemName}.

Finder Details:
Name: ${finderName}
Email: ${finderEmail}
Phone: ${finderPhone || 'Not provided'}

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
