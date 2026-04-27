import React from "react";

const TermsOfService = () => {
  return (
    <div className="globalContainer py-16 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
      <p className="text-sm text-gray-500">Last Updated: February 2026</p>

      <section className="space-y-4">
        <p>
          By accessing and using the Nepal Hatchery Industries Association
          (NHIA) website, you agree to the following terms and conditions.
        </p>

        <h2 className="text-xl font-semibold">1. Use of Website</h2>
        <p>
          This website is intended to provide information about NHIA and its
          activities. You agree to use this website only for lawful purposes.
        </p>

        <h2 className="text-xl font-semibold">2. Intellectual Property</h2>
        <p>
          All content including text, images, and logos are the property of NHIA
          unless otherwise stated. Unauthorized use is prohibited.
        </p>

        <h2 className="text-xl font-semibold">3. Accuracy of Information</h2>
        <p>
          While we strive to provide accurate information, NHIA does not
          guarantee completeness or reliability of all content.
        </p>

        <h2 className="text-xl font-semibold">4. External Links</h2>
        <p>
          Our website may contain links to third-party websites. NHIA is not
          responsible for the content or privacy practices of those websites.
        </p>

        <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
        <p>
          NHIA shall not be liable for any damages resulting from the use of
          this website.
        </p>

        <h2 className="text-xl font-semibold">6. Governing Law</h2>
        <p>These terms are governed by the laws of Nepal.</p>

        <h2 className="text-xl font-semibold">7. Contact Information</h2>
        <p>
          For inquiries regarding these Terms, contact us at:
          <br />
          Email: info@nhia.org.np
          <br />
          Location: Bharatpur, Chitwan, Nepal
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
