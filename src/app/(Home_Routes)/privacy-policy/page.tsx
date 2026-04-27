import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="globalContainer py-16 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last Updated: February 2026</p>

      <section className="space-y-4">
        <p>
          The Nepal Hatchery Industries Association (NHIA) is committed to
          protecting the privacy of our members, partners, and website visitors.
          This Privacy Policy explains how we collect, use, and safeguard your
          information.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name, email address, and phone number</li>
          <li>Business or organization details</li>
          <li>Messages submitted via contact forms</li>
          <li>Website usage data (cookies and analytics)</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Information</h2>
        <p>
          We use collected information to respond to inquiries, provide updates,
          improve our services, and communicate with members and stakeholders.
        </p>

        <h2 className="text-xl font-semibold">3. Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information from unauthorized access or misuse.
        </p>

        <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
        <p>
          NHIA does not sell or trade personal information. Information may only
          be shared when required by law.
        </p>

        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          Our website may use cookies to enhance user experience. You may
          disable cookies in your browser settings.
        </p>

        <h2 className="text-xl font-semibold">6. Contact Us</h2>
        <p>
          For questions regarding this Privacy Policy, contact us at:
          <br />
          Email: info@nhia.org.np
          <br />
          Location: Bharatpur, Chitwan, Nepal
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
