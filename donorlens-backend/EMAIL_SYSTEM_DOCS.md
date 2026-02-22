# 📧 DonorLens Email System Documentation

## 🎯 Overview

The DonorLens email system provides a professional, themed email notification service that matches your site's teal color scheme (#14b8a6). All emails are automatically sent using beautiful HTML templates with your branding.

---

## 📁 File Structure

```
src/
├── config/
│   └── email.config.js           # Email transporter configuration
├── services/
│   └── email.service.js          # Email sending service with methods
├── usecases/
│   └── email/
│       └── SendEmailUsecase.js   # Business logic for emails
└── templates/
    ├── layouts/
    │   └── main.hbs              # Main email layout (wrapper)
    └── email/
        ├── ngo-registration-received.hbs
        ├── ngo-registration-approved.hbs
        ├── ngo-registration-rejected.hbs
        ├── campaign-created.hbs
        └── donation-received.hbs
```

---

## 🚀 How It Works

### 1️⃣ **Email Configuration** ([email.config.js](donorlens-backend/src/config/email.config.js))

This file sets up the Nodemailer transporter with:

- SMTP credentials from your .env file
- Handlebars template engine configuration
- Email verification on startup

**Key Features:**

- Uses your existing Gmail credentials
- Automatically finds templates in `src/templates/email/`
- Uses the main layout wrapper for all emails

### 2️⃣ **Email Service** ([email.service.js](donorlens-backend/src/services/email.service.js))

This service provides ready-to-use methods for different email types:

**Available Methods:**

```javascript
// 1. NGO Registration Received
await emailService.sendNgoRegistrationReceived({
  email: "ngo@example.com",
  ngoName: "Hope Foundation",
  fullName: "John Doe",
});

// 2. NGO Registration Approved
await emailService.sendNgoRegistrationApproved({
  email: "ngo@example.com",
  ngoName: "Hope Foundation",
  fullName: "John Doe",
});

// 3. NGO Registration Rejected
await emailService.sendNgoRegistrationRejected(
  {
    email: "ngo@example.com",
    ngoName: "Hope Foundation",
    fullName: "John Doe",
  },
  "Reason for rejection",
);

// 4. Campaign Created
await emailService.sendCampaignCreated({
  adminEmail: "admin@ngo.com",
  adminName: "John Doe",
  campaignTitle: "Build a School",
  campaignId: "123abc",
});

// 5. Donation Received
await emailService.sendDonationReceived({
  donorEmail: "donor@example.com",
  donorName: "Jane Smith",
  amount: 100,
  campaignTitle: "Build a School",
  ngoName: "Hope Foundation",
});
```

### 3️⃣ **Email Templates** (`.hbs` files)

Templates are written in Handlebars and use the main layout wrapper automatically.

**Template Structure:**

```handlebars
<h2>Email Title</h2>
<p>Dear <strong>{{recipientName}}</strong>,</p>
<p>Your content here...</p>

<div class="info-box">
  <p><strong>Label:</strong> {{dynamicValue}}</p>
</div>

<div class="button-container">
  <a href="{{linkUrl}}" class="button">Click Here</a>
</div>
```

---

## 💻 How to Use in Your Code

### Example 1: Send Email in a Controller

```javascript
// In your controller file
import emailService from "../../services/email.service.js";

export const approveNgoController = async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Your business logic...
    const ngo = await User.findById(ngoId);
    ngo.ngoDetails.status = "APPROVED";
    await ngo.save();

    // Send email (non-blocking)
    try {
      await emailService.sendNgoRegistrationApproved({
        email: ngo.email,
        ngoName: ngo.ngoDetails.ngoName,
        fullName: ngo.fullName,
      });
      console.log("✅ Approval email sent");
    } catch (emailError) {
      console.error("⚠️ Email failed but operation succeeded:", emailError);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Example 2: Send Email in a Usecase

```javascript
// In your usecase file
import emailService from "../../services/email.service.js";

export default async function CreateCampaignUsecase(campaignData, user) {
  // Create campaign logic...
  const campaign = await Campaign.create(campaignData);

  // Send notification email
  try {
    await emailService.sendCampaignCreated({
      adminEmail: user.email,
      adminName: user.fullName,
      campaignTitle: campaign.title,
      campaignId: campaign._id,
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    // Don't fail the operation if email fails
  }

  return campaign;
}
```

---

## 🎨 Adding More Templates

### Step 1: Create the Template File

Create a new `.hbs` file in `src/templates/email/`:

```bash
# Example: welcome-email.hbs
```

```handlebars
<h2>🎉 Welcome to DonorLens!</h2>

<p>Dear <strong>{{userName}}</strong>,</p>

<p>Welcome to our platform! We're excited to have you join us.</p>

<div class="info-box">
  <p><strong>Your Account:</strong></p>
  <p>Email: {{userEmail}}</p>
  <p>Role: {{userRole}}</p>
</div>

<div class="button-container">
  <a href="{{dashboardUrl}}" class="button">Go to Dashboard</a>
</div>

<p>If you have any questions, we're here to help!</p>

<p>Best regards,<br />
  <strong>The DonorLens Team</strong></p>
```

### Step 2: Add Method to Email Service

Add a new method in [email.service.js](donorlens-backend/src/services/email.service.js):

```javascript
async sendWelcomeEmail(userData) {
  return this.sendEmail({
    to: userData.email,
    subject: '🎉 Welcome to DonorLens!',
    template: 'welcome-email', // matches filename without .hbs
    context: {
      userName: userData.fullName,
      userEmail: userData.email,
      userRole: userData.role,
      dashboardUrl: `${process.env.CLIENT_URL}/dashboard`,
    },
  });
}
```

### Step 3: Use It Anywhere

```javascript
import emailService from "../services/email.service.js";

await emailService.sendWelcomeEmail({
  email: "user@example.com",
  fullName: "John Doe",
  role: "USER",
});
```

---

## 🎨 Customizing Templates

### Adding Custom Parameters

You can pass ANY data to templates:

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Custom Email",
  template: "my-template",
  context: {
    // ANY data you want!
    userName: "John",
    orderNumber: "12345",
    products: ["Item 1", "Item 2"],
    totalPrice: 99.99,
    customLink: "https://example.com/verify",
    expiryDate: "2026-12-31",
    // These are automatically added:
    // currentYear, frontendUrl
  },
});
```

**Use them in template:**

```handlebars
<p>Hi {{userName}}!</p>
<p>Order #{{orderNumber}}</p>
<p>Total: ${{totalPrice}}</p>

<ul>
  {{#each products}}
    <li>{{this}}</li>
  {{/each}}
</ul>

<a href="{{customLink}}" class="button">Verify Order</a>
<p>Expires: {{expiryDate}}</p>
```

### Available CSS Classes in Templates

The main layout provides these pre-styled classes:

```css
<h2>               /* Section heading */
<p>                /* Paragraph text */

.info-box          /* Highlighted info box with teal border */
.button-container  /* Centers buttons */
.button            /* Teal gradient button */
.status-badge      /* Colored status badge */
.status-pending    /* Yellow pending status */
.status-approved   /* Green approved status */
.divider           /* Horizontal line separator */

<ul><li>           /* Checkmark list items */
```

### Adding Links

```handlebars
<!-- Simple link -->
<a href="{{myUrl}}">Click here</a>

<!-- Button link -->
<div class="button-container">
  <a href="{{myUrl}}" class="button">Click Here</a>
</div>

<!-- Multiple parameters in URL -->
<a href="{{frontendUrl}}/verify?token={{token}}&email={{email}}">Verify</a>
```

---

## 🔧 Environment Variables

Make sure these are in your `.env` file:

```env
# Email Configuration (Already set in your .env)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=aidwalk1230@gmail.com
SMTP_PASS=gidy mexp gpel ywjn
EMAIL_FROM="The DonorLens Team" <no-reply@donorlens.com>

# Frontend URL (Already set)
CLIENT_URL=http://localhost:5173

# Optional: Support email for rejection messages
SUPPORT_EMAIL=support@donorlens.com
```

**For Production:**

- Update `CLIENT_URL` to your production URL
- Update `SMTP_USER` and `SMTP_PASS` for production email
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)

---

## 📷 Adding Logo to Emails

### Option 1: Use Hosted Logo URL

1. Upload your logo to Cloudinary or your hosting
2. Get the public URL (e.g., `https://res.cloudinary.com/yourcloud/image/upload/logo.png`)
3. Add to .env:
   ```env
   EMAIL_LOGO_URL=https://res.cloudinary.com/yourcloud/image/upload/logo.png
   ```
4. Update [email.service.js](donorlens-backend/src/services/email.service.js):
   ```javascript
   context: {
     ...context,
     logoUrl: process.env.EMAIL_LOGO_URL,
     currentYear: new Date().getFullYear(),
     frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
   },
   ```

### Option 2: Use Base64 Encoded Logo (Embedded)

1. Convert your logo to base64
2. In [main.hbs](donorlens-backend/src/templates/layouts/main.hbs), replace:
   ```html
   <img src="{{logoUrl}}" alt="DonorLens Logo" class="logo" />
   ```
   with:
   ```html
   <img
     src="data:image/png;base64,iVBORw0KG..."
     alt="DonorLens Logo"
     class="logo"
   />
   ```

### Option 3: Create Logo in Public Folder

1. Save logo to `donorlens-frontend/public/logo-email.png`
2. Deploy your frontend
3. Use: `{{frontendUrl}}/logo-email.png`

**Recommended:** Option 1 (Cloudinary URL) is best for reliability.

---

## 🎨 Theme Colors

Your emails use the DonorLens teal theme:

```css
Primary Teal:   #14b8a6  (buttons, accents)
Secondary Teal: #0891b2  (gradients)
Light Teal:     #06b6d4  (backgrounds)

Text Colors:
- Dark:    #0f172a  (headings)
- Medium:  #475569  (body text)
- Light:   #64748b  (footer text)

Backgrounds:
- White:   #ffffff
- Gray:    #f8fafc
- Info box: #f0fdfa
```

To change colors, edit [main.hbs](donorlens-backend/src/templates/layouts/main.hbs) in the `<style>` section.

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check Console Logs:**
   - Look for `✅ Email server is ready` on startup
   - Check for email errors in your terminal

2. **Verify Credentials:**

   ```bash
   # Test your SMTP credentials
   echo $SMTP_USER
   echo $SMTP_PASS
   ```

3. **Gmail App Password:**
   - Don't use your regular Gmail password
   - Generate App Password: Google Account → Security → App Passwords
   - Update `SMTP_PASS` with the app password

4. **Check Spam Folder:**
   - Emails might be in recipient's spam folder

5. **Enable "Less Secure Apps" (if needed):**
   - For Gmail: Enable 2-factor authentication
   - Then generate an App Password

### Template Not Found?

- Ensure template filename matches (without `.hbs`)
- Check file is in `src/templates/email/` folder
- Restart your server after adding new templates

### Variables Not Showing?

- Verify you're passing the variable in `context`
- Check spelling matches between service and template
- Use `{{variableName}}` in template (double curly braces)

---

## 📊 Email Service Status

When your server starts, you'll see:

```bash
✅ Email server is ready to send messages
```

When an email is sent:

```bash
✅ Email sent successfully: <message-id@smtp.gmail.com>
✅ Registration confirmation email sent to: user@example.com
```

If email fails:

```bash
❌ Email sending failed: [error details]
⚠️ Failed to send registration email: [error message]
```

**Note:** Email failures won't break your application - they're handled gracefully with try-catch blocks.

---

## 🚀 Best Practices

1. **Always Use Try-Catch:**

   ```javascript
   try {
     await emailService.sendEmail(...);
   } catch (error) {
     console.error('Email failed:', error);
     // Don't fail the main operation
   }
   ```

2. **Non-Blocking Emails:**
   - Don't let email failures break user registration/actions
   - Log errors but continue execution

3. **Test in Development:**
   - Use a test email address
   - Check spam folders
   - Verify all links work

4. **Production Ready:**
   - Use environment variables for all URLs
   - Add proper error tracking (Sentry, etc.)
   - Consider email queues for high volume (Bull, BeeQueue)

5. **Template Guidelines:**
   - Keep templates simple and clean
   - Test on multiple email clients
   - Use inline CSS (already done in main.hbs)
   - Avoid JavaScript (not supported in emails)

---

## 📚 Examples in Your Codebase

### Currently Implemented:

✅ **NGO Registration** ([RegisterNgoUsecase.js](donorlens-backend/src/usecases/auth/RegisterNgoUsecase.js))

- Sends "Registration Received" email when NGO submits request

### Ready to Implement:

You can add emails to these places:

1. **Admin Approval** - When admin approves/rejects NGO
2. **Campaign Creation** - When NGO creates a campaign
3. **Donation Made** - When user donates to a campaign
4. **Password Reset** - When user requests password reset
5. **Campaign Milestone** - When campaign reaches goal percentage

---

## 🎓 Quick Reference

### Send Email - Short Version

```javascript
import emailService from "../services/email.service.js";

// Use existing method
await emailService.sendNgoRegistrationReceived({ ...data });

// OR send custom email
await emailService.sendEmail({
  to: "user@example.com",
  subject: "My Subject",
  template: "my-template", // matches my-template.hbs
  context: { name: "John", link: "https://..." },
});
```

### Create New Template - Quick Steps

1. Create `src/templates/email/my-template.hbs`
2. Add method to `email.service.js`
3. Call it: `await emailService.myNewMethod(data)`

---

## 💡 Need Help?

- Check the console logs for detailed error messages
- Verify your .env variables are set correctly
- Test with a simple email first before adding complex logic
- Check spam folder if emails aren't arriving

---

**Created for DonorLens** | Email System v1.0 | Updated: February 2026
