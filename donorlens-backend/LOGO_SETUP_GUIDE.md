# 📷 Adding Logo to DonorLens Emails

## 🎯 Quick Answer

**Best Method:** Upload logo to Cloudinary and add URL to emails.

---

## 📝 Step-by-Step Instructions

### Option 1: Upload Logo to Cloudinary (RECOMMENDED ⭐)

This is the most reliable method because the logo is hosted permanently.

#### Step 1: Upload Logo to Cloudinary

You have two ways to do this:

**A. Via Cloudinary Dashboard:**

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Login with your credentials
3. Go to "Media Library"
4. Click "Upload" button
5. Upload your logo file (PNG or JPG recommended)
6. Create a folder called `donorlens/branding` and put logo there
7. Click on the uploaded logo
8. Copy the URL (looks like: `https://res.cloudinary.com/dn5vyodk9/image/upload/v1234567890/donorlens/branding/logo.png`)

**B. Upload Programmatically:**

Create a simple script: `src/scripts/uploadLogo.js`

```javascript
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadLogo() {
  try {
    // Place your logo.png in the same folder as this script
    const logoPath = path.join(__dirname, "logo.png");
    const logoBuffer = fs.readFileSync(logoPath);

    const result = await uploadToCloudinary(logoBuffer, {
      folder: "donorlens/branding",
      originalName: "logo.png",
      resourceType: "image",
    });

    console.log("✅ Logo uploaded successfully!");
    console.log("📋 Logo URL:", result.url);
    console.log("");
    console.log("Add this to your .env file:");
    console.log(`EMAIL_LOGO_URL=${result.url}`);
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
}

uploadLogo();
```

**Run it:**

```bash
# Place your logo.png in src/scripts/ folder
node src/scripts/uploadLogo.js
```

#### Step 2: Add Logo URL to .env

After uploading, add this line to your `.env` file:

```env
# Email Logo
EMAIL_LOGO_URL=https://res.cloudinary.com/dn5vyodk9/image/upload/v1234567890/donorlens/branding/logo.png
```

ℹ️ Replace the URL with your actual logo URL from Step 1.

#### Step 3: Update Email Service

Open: `src/services/email.service.js`

Find the `sendEmail` method and update the context section:

```javascript
async sendEmail({ to, subject, template, context }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"DonorLens" <${process.env.SMTP_USER}>`,
      to,
      subject,
      template,
      context: {
        ...context,
        logoUrl: process.env.EMAIL_LOGO_URL, // ⬅️ ADD THIS LINE
        currentYear: new Date().getFullYear(),
        frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
      },
    };
    // ... rest of the method
```

#### Step 4: Test!

Send a test email and your logo should appear! 🎉

---

### Option 2: Use Frontend Public Folder

This works if your frontend is deployed and accessible.

#### Step 1: Add Logo to Frontend

Save your logo as: `donorlens-frontend/public/logo-email.png`

**Recommended specs:**

- Format: PNG (transparent background)
- Size: 600px x 200px (or 3:1 ratio)
- File size: Under 100KB

#### Step 2: Deploy Frontend

Make sure your frontend is accessible at `CLIENT_URL` (e.g., http://localhost:5173)

#### Step 3: Update .env

```env
EMAIL_LOGO_URL=http://localhost:5173/logo-email.png
```

For production:

```env
EMAIL_LOGO_URL=https://yourdomain.com/logo-email.png
```

#### Step 4: Update Email Service

Same as Option 1, Step 3 above.

---

### Option 3: Base64 Embedded Logo (Not Recommended)

⚠️ This increases email size and may be blocked by some email providers.

#### Step 1: Convert Logo to Base64

Online tool: [Base64 Image Encoder](https://www.base64-image.de/)

Or use Node.js:

```javascript
const fs = require("fs");
const logoBuffer = fs.readFileSync("logo.png");
const base64Logo = logoBuffer.toString("base64");
console.log(`data:image/png;base64,${base64Logo}`);
```

#### Step 2: Update main.hbs Directly

Open: `src/templates/layouts/main.hbs`

Find this line:

```html
<img
  src="{{logoUrl}}"
  alt="DonorLens Logo"
  class="logo"
  style="display: {{#if logoUrl}}block{{else}}none{{/if}}; margin: 0 auto;"
/>
```

Replace with:

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  alt="DonorLens Logo"
  class="logo"
  style="margin: 0 auto;"
/>
```

(Replace with your actual base64 string)

---

## 🎨 Logo Specifications

### Optimal Logo Specs for Emails:

**Dimensions:**

- Width: 150-200px (displayed size)
- Original: 450-600px (3x for retina)
- Height: Proportional (usually 50-60px display)

**Format:**

- PNG (with transparent background) ✅ Best
- JPG (with white/colored background) ✅ Good
- SVG ❌ Not recommended (poor email support)

**File Size:**

- Under 50KB ✅ Ideal
- Under 100KB ✅ Good
- Over 100KB ⚠️ May slow loading

**Colors:**

- Match your teal theme: #14b8a6
- Keep it simple (less than 5 colors)
- Ensure good contrast against white background

---

## 🧪 Testing Logo Display

### Test Email with Logo

Create a test route or update existing test:

```javascript
// File: src/routes/test/test.routes.js
router.get("/test-logo", async (req, res) => {
  try {
    await emailService.sendEmail({
      to: "YOUR_EMAIL@gmail.com", // Your test email
      subject: "🧪 Logo Test - DonorLens",
      template: "ngo-registration-received",
      context: {
        adminName: "Test User",
        ngoName: "Test Organization",
        email: "test@example.com",
        submissionDate: new Date().toLocaleDateString(),
      },
    });

    res.json({
      success: true,
      message: "Test email sent! Check your inbox.",
      logoUrl: process.env.EMAIL_LOGO_URL || "No logo URL set",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Visit: `http://localhost:5000/api/test/test-logo`

### What to Check:

✅ Logo appears correctly  
✅ Logo is not too large or too small  
✅ Logo is centered  
✅ Logo works on mobile  
✅ Logo loads quickly  
✅ Logo appears in Gmail, Outlook, Yahoo

---

## 💡 Pro Tips

### 1. Create Multiple Logo Versions

Consider having:

- `logo-light.png` - For light backgrounds (your main logo)
- `logo-dark.png` - For dark backgrounds (if needed)
- `logo-icon.png` - Just the icon (for footers)

```env
EMAIL_LOGO_URL=https://cloudinary.com/.../logo-light.png
EMAIL_LOGO_ICON_URL=https://cloudinary.com/.../logo-icon.png
```

### 2. Add Alt Text

The template already has: `alt="DonorLens Logo"`

This helps with:

- Accessibility
- Shows text if image doesn't load
- Better for screen readers

### 3. Use CDN/Fast Hosting

Cloudinary is great because:

- Global CDN (fast worldwide)
- Automatic optimization
- Image transformations
- Reliable uptime

### 4. Optimize Before Uploading

Use tools like:

- [TinyPNG](https://tinypng.com/) - Compress PNG
- [Squoosh](https://squoosh.app/) - Optimize any image
- Photoshop/Figma - Export for web

---

## 🔍 Troubleshooting

### Logo Not Showing?

**Check 1: Is logoUrl being passed?**

```javascript
// Add console.log in email.service.js
console.log("Logo URL:", process.env.EMAIL_LOGO_URL);
```

**Check 2: Is URL accessible?**

- Copy the URL
- Paste in browser
- Should see your logo

**Check 3: Is .env loaded?**

```javascript
console.log("ENV loaded:", process.env.CLIENT_URL);
```

**Check 4: Restart server**

```bash
# .env changes require restart
npm run dev
```

### Logo Too Large/Small?

Update in `src/templates/layouts/main.hbs`:

```css
.logo {
  max-width: 150px; /* Change this */
  height: auto;
}
```

Or for specific size:

```css
.logo {
  width: 180px;
  height: 60px;
  object-fit: contain;
}
```

### Logo Blocked by Email Client?

Some email clients block images by default:

- Gmail: Usually shows images
- Outlook: May block by default
- Yahoo: Usually shows images

**Solution:** Users need to "Show Images" or whitelist your domain.

This is why `alt="DonorLens Logo"` is important - shows text if image blocked!

---

## 📋 Quick Checklist

- [ ] Upload logo to Cloudinary (or choose another method)
- [ ] Get logo URL
- [ ] Add `EMAIL_LOGO_URL=...` to .env
- [ ] Update email.service.js context with logoUrl
- [ ] Restart server
- [ ] Send test email
- [ ] Check logo appears correctly
- [ ] Test on mobile
- [ ] Verify logo size is appropriate
- [ ] Confirm alt text shows when images blocked

---

## 🎯 Current Logo Location in Templates

The logo appears in: `src/templates/layouts/main.hbs`

```html
<div class="email-header">
  <div class="logo-container">
    <!-- Logo displays here -->
    <img
      src="{{logoUrl}}"
      alt="DonorLens Logo"
      class="logo"
      style="display: {{#if logoUrl}}block{{else}}none{{/if}}; margin: 0 auto;"
    />
  </div>
  <h1>DonorLens</h1>
  <p>Empowering Change Through Transparency</p>
</div>
```

**How it works:**

- If `logoUrl` is set → Logo shows above "DonorLens" text
- If `logoUrl` is empty → Logo is hidden, only text shows
- Logo is centered in the teal gradient header

---

## ✅ Recommended Setup (Summary)

1. **Upload to Cloudinary** (most reliable)
2. **Add to .env:** `EMAIL_LOGO_URL=https://...`
3. **Update email.service.js:** Add `logoUrl: process.env.EMAIL_LOGO_URL`
4. **Restart server**
5. **Test!**

**That's it! Your logo will appear in all emails! 🎉**

---

## 🆘 Need Help?

If logo still not working:

1. Check console logs for any errors
2. Verify .env file has correct URL
3. Test URL in browser (should show logo)
4. Restart development server
5. Send test email with console logs enabled

---

**For more email help, see:**

- [EMAIL_SYSTEM_DOCS.md](./EMAIL_SYSTEM_DOCS.md) - Complete documentation
- [QUICK_EMAIL_GUIDE.md](./QUICK_EMAIL_GUIDE.md) - Usage examples
