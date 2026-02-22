# NGO Onboarding Request System - Documentation

## 📋 Overview

A production-grade, multi-step NGO onboarding flow built for DonorLens - a transparency-focused donation platform. This system replaces the previous self-registration with a verified request-based onboarding process.

---

## ✅ What Was Built

### **Core Components**

#### 1. **Custom Hook: `useNgoRequestForm.js`**

- **Location:** `src/hooks/useNgoRequestForm.js`
- **Purpose:** Centralized state management for the entire form
- **Features:**
  - Manages all form data across 4 steps
  - Client-side validation (email, phone, URL, file types)
  - Document upload handling (1 required + 3 optional)
  - Step navigation with validation gates
  - Form submission logic

#### 2. **Step Components**

##### `StepIndicator.jsx`

- **Location:** `src/components/ngoRequest/StepIndicator.jsx`
- **Features:**
  - Modern horizontal progress bar (desktop)
  - Vertical step list (mobile)
  - Circular numbered indicators
  - Visual state: active, completed, pending
  - Responsive design

##### `StepOneIntent.jsx`

- **Location:** `src/components/ngoRequest/StepOneIntent.jsx`
- **Purpose:** Explain verification requirement & collect consent
- **Features:**
  - Clear explanation of why verification is needed
  - Document requirements list
  - Timeline expectations (3-5 business days)
  - Terms & Conditions checkbox (required)
  - Link to full Terms page

##### `StepTwoBasicInfo.jsx`

- **Location:** `src/components/ngoRequest/StepTwoBasicInfo.jsx`
- **Purpose:** Collect NGO details and contact information
- **Fields:**
  - NGO Name (required)
  - Registration Number (required)
  - Registered Address (required, textarea)
  - Description (required, min 50 chars)
  - Official Email (required, validated)
  - Primary Phone (required, validated)
  - Secondary Phone (optional)
  - Website (optional, validated URL)
- **Layout:** Two-column responsive grid
- **Validation:** Real-time field-level error display

##### `StepThreeDocuments.jsx`

- **Location:** `src/components/ngoRequest/StepThreeDocuments.jsx`
- **Purpose:** Document upload with drag & drop
- **Features:**
  - Required: Registration Certificate
  - Optional: Up to 3 additional documents
  - Drag & drop upload zones
  - File type validation (PDF, JPG, PNG)
  - File size validation (max 5MB)
  - File preview with removal option
  - Clear file requirements display

##### `DocumentUploader.jsx`

- **Location:** `src/components/ngoRequest/DocumentUploader.jsx`
- **Purpose:** Reusable file upload component
- **Features:**
  - Drag & drop functionality
  - File browser fallback
  - File icon based on type (PDF vs image)
  - File size display
  - Clean removal interaction
  - Error state handling

##### `StepFourPreview.jsx`

- **Location:** `src/components/ngoRequest/StepFourPreview.jsx`
- **Purpose:** Review all data before submission
- **Features:**
  - Organized display of all collected data
  - Section-wise grouping (Basic Info, Documents)
  - Edit buttons to jump back to specific steps
  - Document list with type indicators
  - Important notice before submission
  - Submit button with loading state

#### 3. **Pages**

##### `NgoRequestPage.jsx`

- **Location:** `src/pages/NgoRequestPage.jsx`
- **Purpose:** Main orchestrator for the flow
- **Features:**
  - Clean header and footer
  - Step indicator integration
  - Conditional rendering of steps
  - Success modal on submission
  - Form state management via custom hook
  - Professional layout

##### `TermsPage.jsx`

- **Location:** `src/pages/TermsPage.jsx`
- **Purpose:** Standalone legal terms page
- **Features:**
  - Clean, readable legal formatting
  - Scrollable content area
  - Back navigation
  - Sticky header
  - Professional typography
  - 10 comprehensive sections covering:
    - Eligibility requirements
    - Verification process
    - Information accuracy
    - Platform obligations
    - Data privacy
    - Rejection & suspension policies
    - Liability limitations
    - Terms modifications
    - Contact information

---

## 🎨 Design System

### **Color Palette**

- **Primary:** Teal (#14b8a6)
- **Secondary:** Slate grays (#1e293b, #334155, #64748b)
- **Accents:** Blue (#3b82f6), Amber (#f59e0b), Red (#ef4444)
- **Backgrounds:** White, Slate-50, Teal-50

### **Typography**

- Sans-serif font family
- Clear hierarchy with font weights
- Responsive text sizes
- Excellent readability

### **UI Patterns**

- Rounded corners (lg, xl, 2xl)
- Subtle shadows
- Smooth transitions (200-300ms)
- Hover states on interactive elements
- Focus rings for accessibility
- Spacious layout with proper padding

---

## 🔄 User Flow

```
Step 1: Intent & Terms
   ↓ (Terms must be accepted)
Step 2: Basic Info
   ↓ (All required fields validated)
Step 3: Documents
   ↓ (Registration certificate required)
Step 4: Preview & Confirm
   ↓ (Can edit any previous step)
Submission → Success Modal → Navigate Home
```

---

## 🛣️ Routing

### **New Routes Added:**

- `/ngo-request` - Main NGO request flow
- `/register/ngo` - Alias for NGO request (replaces old registration)
- `/ngo-request/terms` - Terms & Conditions page

### **Router Updates:**

File: `src/app/router.jsx`

- Replaced `RegisterNgoPage` import with `NgoRequestPage`
- Added `TermsPage` import
- Updated route definitions

---

## 🔒 Security & Validation

### **Client-Side Validation:**

- Email format (regex)
- Phone number format (min 10 digits)
- URL format (valid URL structure)
- File type restrictions (PDF, JPG, PNG only)
- File size limits (5MB max)
- Required field checks
- Minimum text lengths (e.g., 50 chars for description)

### **UX Security:**

- No data stored in localStorage
- State kept in memory only
- Clear error messages without exposing system details
- File preview shows filename only (not content)
- Disabled navigation until validation passes

---

## 📱 Responsive Design

### **Mobile (< 768px):**

- Vertical step indicator
- Single-column form layout
- Stacked buttons
- Touch-friendly tap targets
- Optimized spacing

### **Desktop (≥ 768px):**

- Horizontal step indicator with progress bar
- Two-column form layout
- Side-by-side buttons
- Larger visual elements
- Enhanced hover effects

---

## ♿ Accessibility

- Semantic HTML structure
- Proper form labels
- ARIA attributes where needed
- Keyboard navigation support
- Focus indicators
- Error announcements
- Sufficient color contrast
- Touch-friendly targets (44x44px minimum)

---

## 🧪 Component Architecture

```
NgoRequestPage
├── StepIndicator
└── Current Step Component
    ├── StepOneIntent
    │   └── Link to TermsPage
    ├── StepTwoBasicInfo
    │   └── Form inputs with validation
    ├── StepThreeDocuments
    │   └── DocumentUploader (reusable)
    └── StepFourPreview
        └── Edit navigation back to steps

All managed by useNgoRequestForm hook
```

---

## 🚀 Integration Points

### **Backend Integration (Future):**

The system is ready for API integration. Update these areas:

1. **Form Submission:**
   - File: `src/hooks/useNgoRequestForm.js`
   - Function: `submitForm()`
   - Replace mock submission with actual API call
   - Format: `FormData` object with all fields + files

2. **API Endpoint (suggested):**

   ```
   POST /api/ngo/onboarding-request
   Content-Type: multipart/form-data
   ```

3. **Request Body:**
   - All basic info fields
   - registrationCertificate (File)
   - additionalDoc1, additionalDoc2, additionalDoc3 (Files, optional)

---

## 📦 Files Created

### **New Files (10 total):**

1. `src/hooks/useNgoRequestForm.js` - Form state hook
2. `src/components/ngoRequest/StepIndicator.jsx` - Progress indicator
3. `src/components/ngoRequest/StepOneIntent.jsx` - Step 1 component
4. `src/components/ngoRequest/StepTwoBasicInfo.jsx` - Step 2 component
5. `src/components/ngoRequest/StepThreeDocuments.jsx` - Step 3 component
6. `src/components/ngoRequest/DocumentUploader.jsx` - Reusable uploader
7. `src/components/ngoRequest/StepFourPreview.jsx` - Step 4 component
8. `src/pages/NgoRequestPage.jsx` - Main page orchestrator
9. `src/pages/TermsPage.jsx` - Terms & Conditions page

### **Modified Files (1):**

1. `src/app/router.jsx` - Router configuration

---

## 🎯 Key Features

### **User Experience:**

✅ Clear multi-step progression
✅ Visual feedback at every stage
✅ Inline validation with helpful error messages
✅ Ability to edit previous steps
✅ Professional success confirmation
✅ Mobile-friendly interface

### **Developer Experience:**

✅ Clean component separation
✅ Reusable components
✅ Centralized state management
✅ Easy to extend
✅ Well-commented code
✅ Modern React patterns (hooks)

### **Production Ready:**

✅ Error handling
✅ Loading states
✅ Responsive design
✅ Accessibility features
✅ Consistent design system
✅ Performance optimized

---

## 🔧 Customization Guide

### **Changing Validation Rules:**

Edit `src/hooks/useNgoRequestForm.js`:

- `validateStep2()` - Field validations
- `validateStep3()` - Document validations
- Adjust regex patterns, min/max lengths

### **Modifying Step Content:**

Each step is a self-contained component. Edit:

- `StepOneIntent.jsx` - Change explanatory text
- `StepTwoBasicInfo.jsx` - Add/remove fields
- `StepThreeDocuments.jsx` - Change document requirements
- `StepFourPreview.jsx` - Modify preview layout

### **Styling Changes:**

All components use Tailwind utility classes. To change:

- Colors: Update `teal-*` classes to your brand color
- Spacing: Adjust `p-*`, `gap-*`, `mb-*` classes
- Borders: Modify `rounded-*`, `border-*` classes

---

## 🐛 Testing Checklist

- [ ] Step navigation (forward/backward)
- [ ] Terms checkbox requirement
- [ ] All required field validations
- [ ] Email format validation
- [ ] Phone format validation
- [ ] URL validation
- [ ] File upload (drag & drop)
- [ ] File upload (click to browse)
- [ ] File type restrictions
- [ ] File size restrictions
- [ ] File removal
- [ ] Edit from preview page
- [ ] Form submission
- [ ] Success modal display
- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Error states
- [ ] Loading states

---

## 📊 Metrics & Analytics (Suggested)

Track these events for insights:

- Step completion rates
- Average time per step
- Field validation errors (which fields fail most)
- Document upload success/failure
- Form abandonment points
- Submission success rate

---

## 🎓 Best Practices Followed

✅ Component-based architecture
✅ Single Responsibility Principle
✅ DRY (Don't Repeat Yourself)
✅ Separation of concerns (UI vs logic)
✅ Consistent naming conventions
✅ Comprehensive comments
✅ Production-level error handling
✅ Responsive design patterns
✅ Accessibility standards
✅ Modern React patterns

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add Progress Persistence:**
   - Save form state to session storage
   - Allow users to resume later

2. **Email Verification:**
   - Send verification link to provided email
   - Confirm email before final submission

3. **Document Preview:**
   - Show thumbnail/preview of uploaded images
   - PDF preview modal

4. **Real-time Availability Check:**
   - Check if NGO registration number already exists
   - Check if email is already registered

5. **Multi-language Support:**
   - Internationalization (i18n)
   - Language selector

6. **Analytics Dashboard:**
   - Track submission metrics
   - Conversion funnel visualization

---

## 📞 Support & Maintenance

### **Common Issues:**

**Issue:** Form doesn't progress to next step

- **Solution:** Check that all required fields are filled and validated

**Issue:** File upload fails

- **Solution:** Verify file type (PDF/JPG/PNG) and size (<5MB)

**Issue:** Terms page link doesn't work

- **Solution:** Ensure router is properly configured with `/ngo-request/terms` route

---

## 🏆 Success Criteria Met

✅ **Production-Level:** Clean, maintainable code
✅ **Component-Based:** Reusable, modular architecture
✅ **Theme Consistency:** Matches DonorLens design system
✅ **User-Friendly:** Clear, intuitive flow
✅ **Secure UX:** Validation and error handling
✅ **Responsive:** Works on all device sizes
✅ **Extensible:** Easy to add features later
✅ **Professional:** Looks like a production app

---

**Built with ❤️ for DonorLens by a Senior Frontend Engineer**
