import React from "react";
import { Link } from "react-router-dom";
import LegalLayout, { Section, Contact } from "./LegalLayout";
import { SITE } from "../../config/site";

const SECTIONS = [
  ["about", "About the service"],
  ["not-medical", "Not a substitute for care"],
  ["accounts", "Accounts"],
  ["practitioners", "Practitioners"],
  ["ai", "AI-drafted content"],
  ["use", "Acceptable use"],
  ["content", "Your content"],
  ["availability", "Availability"],
  ["liability", "Limitation of liability"],
  ["ending", "Ending your use"],
  ["law", "Governing law"],
  ["changes", "Changes to these terms"],
  ["contact", "Contact"],
];

const TermsAndConditions = () => (
  <LegalLayout
    title="Terms and Conditions"
    sections={SECTIONS}
    intro={`These terms apply when you use ${SITE.name}. By creating an account or using the service, you agree to them. Please also read the Privacy Policy, which explains how your information is handled.`}
  >
    <Section id="about" title="About the service">
      <p>{SITE.name} is a tool for Ayurvedic dietitians and their patients. It offers a dosha questionnaire, a food library with nutrient and Ayurvedic information, weekly diet plans, daily logging, a food photo scanner, messaging and appointments. It is run by {SITE.owner}.</p>
    </Section>

    <Section id="not-medical" title="Not a substitute for care">
      <p>{SITE.name} does not diagnose or treat any condition. The dosha questionnaire is a screening aid, not a clinical assessment, and nutrient figures, including food scanner estimates, are approximate. Always follow the advice of a qualified practitioner, and seek medical help for any urgent or serious health concern.</p>
    </Section>

    <Section id="accounts" title="Accounts">
      <p>You must give accurate information when you register and keep it up to date. You are responsible for keeping your password secret and for activity on your account. Tell us at once if you think someone else has used it.</p>
    </Section>

    <Section id="practitioners" title="Practitioners">
      <p>If you register as a practitioner, you confirm that you hold the registration you entered and are allowed to practise. You are responsible for the plans you approve and the advice you give your patients. Review every AI-drafted plan before approving it, and only link patients who have agreed to work with you.</p>
    </Section>

    <Section id="ai" title="AI-drafted content">
      <p>Weekly plans, assistant replies and food scan results are produced with the help of AI services. They can be wrong or unsuitable. Plans are drafts until a practitioner approves them, and assistant replies are general information, not advice for your situation.</p>
    </Section>

    <Section id="use" title="Acceptable use">
      <p>Do not use {SITE.name} to break the law; to access another person's account or records; to upload anything harmful, unlawful or that you have no right to share; to impersonate a practitioner; or to interfere with or overload the service.</p>
    </Section>

    <Section id="content" title="Your content">
      <p>You keep ownership of the information and files you add. You allow us to store and process them only to run the service for you and your practitioner, as described in the <Link to="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link>.</p>
    </Section>

    <Section id="availability" title="Availability">
      <p>{SITE.name} runs on free hosting. It may be slow to start after a period without use, and may sometimes be unavailable or change without notice. Keep your own copies of anything important.</p>
    </Section>

    <Section id="liability" title="Limitation of liability">
      <p>The service is provided as it is, without warranties. To the extent the law allows, {SITE.owner} is not liable for any loss or harm arising from your use of {SITE.name}, including decisions based on its content. Nothing in these terms limits liability that cannot be limited by law.</p>
    </Section>

    <Section id="ending" title="Ending your use">
      <p>You can stop using {SITE.name} at any time and ask for your account to be deleted. We may suspend or close accounts that break these terms.</p>
    </Section>

    <Section id="law" title="Governing law">
      <p>These terms are governed by the laws of India. Any dispute will be handled by the courts at Ghaziabad, Uttar Pradesh.</p>
    </Section>

    <Section id="changes" title="Changes to these terms">
      <p>We may update these terms. The date at the top of the page shows the latest version, and continuing to use the service means you accept the changes.</p>
    </Section>

    <Section id="contact" title="Contact">
      <p>Questions about these terms can be sent to <Contact />.</p>
    </Section>
  </LegalLayout>
);

export default TermsAndConditions;
