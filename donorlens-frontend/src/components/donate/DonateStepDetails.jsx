import DonateFormInput from './DonateFormInput';

const PersonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const AddressIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CityIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default function DonateStepDetails({ donorInfo, updateDonorInfo, errors }) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Your Details</h2>
      <p className="text-sm text-slate-500 mb-8">Your information is kept private and secure.</p>

      <div className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DonateFormInput
            label="First Name"
            id="first_name"
            name="first_name"
            placeholder="Saman"
            value={donorInfo.firstName}
            onChange={(e) => updateDonorInfo('firstName', e.target.value)}
            error={errors.firstName}
            required
            icon={<PersonIcon />}
          />
          <DonateFormInput
            label="Last Name"
            id="last_name"
            name="last_name"
            placeholder="Perera"
            value={donorInfo.lastName}
            onChange={(e) => updateDonorInfo('lastName', e.target.value)}
            error={errors.lastName}
            required
            icon={<PersonIcon />}
          />
        </div>

        <DonateFormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="saman@gmail.com"
          value={donorInfo.email}
          onChange={(e) => updateDonorInfo('email', e.target.value)}
          error={errors.email}
          required
          icon={<EmailIcon />}
        />

        <DonateFormInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          placeholder="0771234567"
          value={donorInfo.phone}
          onChange={(e) => updateDonorInfo('phone', e.target.value)}
          error={errors.phone}
          required
          icon={<PhoneIcon />}
        />

        <DonateFormInput
          label="Address"
          id="address"
          name="address"
          placeholder="No. 1, Galle Road"
          value={donorInfo.address}
          onChange={(e) => updateDonorInfo('address', e.target.value)}
          error={errors.address}
          required
          icon={<AddressIcon />}
        />

        <DonateFormInput
          label="City"
          id="city"
          name="city"
          placeholder="Colombo"
          value={donorInfo.city}
          onChange={(e) => updateDonorInfo('city', e.target.value)}
          error={errors.city}
          required
          icon={<CityIcon />}
        />
      </div>
    </div>
  );
}
