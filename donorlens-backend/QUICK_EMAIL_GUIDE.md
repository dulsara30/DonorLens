# 🚀 Quick Email Usage Guide - DonorLens

## 📋 Current Implementation Status

### ✅ Already Implemented (Working Now!)

1. **NGO Registration Email** - Automatically sent when NGO submits registration
2. **Campaign Creation Email** - Automatically sent when NGO admin creates a campaign

### 🎯 Ready to Add (Just Copy & Paste!)

---

## 💼 Example 1: Admin Approves NGO

When an admin approves an NGO registration:

```javascript
// File: src/controllers/admin/AdminNgoApprovalController.js
import emailService from "../../services/email.service.js";
import User from "../../models/user/User.js";

export const approveNgoController = async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Find the NGO admin user
    const ngoAdmin = await User.findById(ngoId);

    if (!ngoAdmin) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Update status to APPROVED
    ngoAdmin.ngoDetails.status = "APPROVED";
    ngoAdmin.isActive = true;
    await ngoAdmin.save();

    // 🎉 Send approval email
    try {
      await emailService.sendNgoRegistrationApproved({
        email: ngoAdmin.email,
        ngoName: ngoAdmin.ngoDetails.ngoName,
        fullName: ngoAdmin.fullName,
      });
      console.log("✅ Approval email sent!");
    } catch (emailError) {
      console.error("⚠️ Email failed:", emailError);
    }

    res.json({
      success: true,
      message: "NGO approved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## ❌ Example 2: Admin Rejects NGO

When an admin rejects an NGO registration:

```javascript
// File: src/controllers/admin/AdminNgoApprovalController.js
export const rejectNgoController = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { reason } = req.body; // Rejection reason from admin

    const ngoAdmin = await User.findById(ngoId);

    if (!ngoAdmin) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Update status to REJECTED
    ngoAdmin.ngoDetails.status = "REJECTED";
    await ngoAdmin.save();

    // 📧 Send rejection email with reason
    try {
      await emailService.sendNgoRegistrationRejected(
        {
          email: ngoAdmin.email,
          ngoName: ngoAdmin.ngoDetails.ngoName,
          fullName: ngoAdmin.fullName,
        },
        reason || "Your application did not meet our requirements.",
      );

      console.log("✅ Rejection email sent!");
    } catch (emailError) {
      console.error("⚠️ Email failed:", emailError);
    }

    res.json({
      success: true,
      message: "NGO rejected",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 💰 Example 3: User Makes Donation

When a user successfully donates to a campaign:

```javascript
// File: src/usecases/donations/CreateDonationUsecase.js
import emailService from "../../services/email.service.js";

export default async function CreateDonationUsecase(donationData) {
  // Your donation creation logic...
  const donation = await Donation.create(donationData);

  // Get campaign and donor details
  const campaign = await Campaign.findById(donation.campaignId);
  const donor = await User.findById(donation.donorId);
  const ngo = await User.findById(campaign.createdBy);

  // 🎉 Send thank you email to donor
  try {
    await emailService.sendDonationReceived({
      donorEmail: donor.email,
      donorName: donor.fullName,
      amount: donation.amount,
      campaignTitle: campaign.title,
      ngoName: ngo.ngoDetails.ngoName,
    });
    console.log("✅ Donation receipt sent!");
  } catch (emailError) {
    console.error("⚠️ Email failed:", emailError);
  }

  return donation;
}
```

---

## 🔔 Example 4: Password Reset Email (New Template)

### Step 1: Create Template

Create: `src/templates/email/password-reset.hbs`

```handlebars
<h2>🔒 Password Reset Request</h2>

<p>Dear <strong>{{userName}}</strong>,</p>

<p>You requested to reset your password for your DonorLens account.</p>

<div class="info-box">
  <p><strong>Account:</strong> {{userEmail}}</p>
  <p><strong>Request Time:</strong> {{requestTime}}</p>
</div>

<p>Click the button below to reset your password. This link will expire in 1
  hour.</p>

<div class="button-container">
  <a href="{{resetLink}}" class="button">Reset Password</a>
</div>

<p><strong>⚠️ Important:</strong></p>
<ul>
  <li>This link expires in 1 hour</li>
  <li>If you didn't request this, please ignore this email</li>
  <li>Your password won't change until you create a new one</li>
</ul>

<div class="divider"></div>

<p>If the button doesn't work, copy and paste this link into your browser:</p>
<p
  style="font-size: 12px; color: #64748b; word-break: break-all;"
>{{resetLink}}</p>

<p>Best regards,<br />
  <strong>The DonorLens Team</strong></p>
```

### Step 2: Add Method to Email Service

In `src/services/email.service.js`, add:

```javascript
/**
 * Send password reset email
 * @param {Object} userData - User data
 * @param {string} userData.email - User's email
 * @param {string} userData.fullName - User's name
 * @param {string} resetToken - Password reset token
 */
async sendPasswordReset(userData, resetToken) {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  return this.sendEmail({
    to: userData.email,
    subject: '🔒 Password Reset Request - DonorLens',
    template: 'password-reset',
    context: {
      userName: userData.fullName,
      userEmail: userData.email,
      resetLink: resetLink,
      requestTime: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  });
}
```

### Step 3: Use in Controller

```javascript
// File: src/controllers/auth/PasswordResetController.js
import emailService from "../../services/email.service.js";
import crypto from "crypto";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    try {
      await emailService.sendPasswordReset(user, resetToken);
      console.log("✅ Password reset email sent!");
    } catch (emailError) {
      console.error("⚠️ Email failed:", emailError);
    }

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 📧 Generic Email for Any Purpose

If you need to send a custom email not covered by existing templates:

```javascript
import emailService from "../services/email.service.js";

// Send any custom email
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Your Custom Subject",
  template: "your-template-name", // matches your-template-name.hbs
  context: {
    // Pass ANY data you want
    name: "John Doe",
    customMessage: "Hello there!",
    actionUrl: "https://example.com/action",
    anyOtherData: "You can pass anything here",
  },
});
```

---

## 🎨 Adding a Logo to Emails

### Option A: Upload Logo to Cloudinary (RECOMMENDED)

1. **Upload your logo:**

   ```javascript
   // Use your existing cloudinary service
   const logoUpload = await uploadToCloudinary(logoFile, {
     folder: "donorlens/branding",
   });
   // You'll get: logoUpload.url
   ```

2. **Add to .env:**

   ```env
   EMAIL_LOGO_URL=https://res.cloudinary.com/your-cloud/image/upload/v123/logo.png
   ```

3. **Update email.service.js:**

   ```javascript
   // In sendEmail method, update context:
   context: {
     ...context,
     logoUrl: process.env.EMAIL_LOGO_URL, // Add this line
     currentYear: new Date().getFullYear(),
     frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
   },
   ```

4. **Done!** Logo will appear in all emails automatically.

### Option B: Use Frontend Public Folder

1. Save logo as: `donorlens-frontend/public/email-logo.png`
2. Deploy your frontend
3. Logo URL: `http://localhost:5173/email-logo.png` (development)
4. Production: `https://yourdomain.com/email-logo.png`

---

## 🧪 Testing Emails

### Test Email Sending

Create a test route:

```javascript
// File: src/routes/test/test.routes.js
import express from "express";
import emailService from "../../services/email.service.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await emailService.sendEmail({
      to: "YOUR_TEST_EMAIL@gmail.com", // Change this!
      subject: "🧪 Test Email from DonorLens",
      template: "ngo-registration-received",
      context: {
        adminName: "Test User",
        ngoName: "Test NGO",
        email: "test@example.com",
        submissionDate: new Date().toLocaleDateString(),
      },
    });

    res.json({ success: true, message: "Test email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

Then visit: `http://localhost:5000/api/test/test-email`

---

## ✨ Pro Tips

### 1. Always Use Try-Catch

```javascript
try {
  await emailService.sendEmail(...);
} catch (error) {
  // Don't break the main operation if email fails
  console.error('Email error:', error);
}
```

### 2. Add Helpful Console Logs

```javascript
console.log('📧 Sending email to:', userEmail);
await emailService.sendEmail(...);
console.log('✅ Email sent successfully!');
```

### 3. Pass Only Required Data

```javascript
// ❌ Don't do this
await emailService.sendNgoRegistrationApproved(entireUserObject);

// ✅ Do this
await emailService.sendNgoRegistrationApproved({
  email: user.email,
  ngoName: user.ngoDetails.ngoName,
  fullName: user.fullName,
});
```

### 4. Use Environment URLs

```javascript
// ❌ Don't hardcode
const link = "http://localhost:5173/verify";

// ✅ Use environment variable
const link = `${process.env.CLIENT_URL}/verify`;
```

---

## 🔍 Troubleshooting

### Email Not Received?

1. Check console for errors
2. Check spam/junk folder
3. Verify SMTP credentials in .env
4. Test with: `npm run dev` (watch console output)

### Template Not Found?

- Restart server after creating new template
- Check filename (no `.hbs` in service call)
- Check file is in `src/templates/email/` folder

### Variables Not Showing?

- Check you're passing variable in `context`
- Check spelling matches in template
- Use `{{variableName}}` (double curly braces)

---

## 📝 Checklist for Adding New Email

- [ ] Create `.hbs` template in `src/templates/email/`
- [ ] Add method to `email.service.js`
- [ ] Import `emailService` in your file
- [ ] Call the method with try-catch
- [ ] Test with your email address
- [ ] Check spam folder
- [ ] Verify all links work
- [ ] Update this guide with your new example! 😊

---

## 🎯 Summary

**You have 5 email types ready to use:**

1. ✅ NGO Registration Received (auto-sent)
2. ✅ NGO Registration Approved (ready to add)
3. ✅ NGO Registration Rejected (ready to add)
4. ✅ Campaign Created (auto-sent)
5. ✅ Donation Received (ready to add)

**To use:**

```javascript
import emailService from "./services/email.service.js";
await emailService.sendNgoRegistrationApproved({ ...data });
```

**That's it! You're ready to send beautiful emails! 🎉**

---

For detailed docs, see: [EMAIL_SYSTEM_DOCS.md](./EMAIL_SYSTEM_DOCS.md)
