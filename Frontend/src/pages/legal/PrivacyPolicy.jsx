import React from "react";
import LegalLayout, { Section, Contact } from "./LegalLayout";
import { SITE } from "../../config/site";

const SECTIONS = [
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["third-parties", "Services we rely on"],
  ["storage", "Where data is stored"],
  ["sharing", "Who can see your data"],
  ["retention", "How long we keep it"],
  ["rights", "Your choices and rights"],
  ["security", "Security"],
  ["children", "Children"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact"],
];

const PrivacyPolicy = () => (
  <LegalLayout
    title="Privacy Policy"
    sections={SECTIONS}
    intro={`This policy explains what information ${SITE.name} collects when you use it, why, where it is kept and who can see it. ${SITE.name} is run by ${SITE.owner}.`}
  >
    <Section id="collect" title="What we collect">
      <p><strong className="text-text-primary">Account details.</strong> Patients give their name, email, phone number, age and gender. Practitioners give their name, email, optional phone and gender, medical registration number, council, and optionally a clinic name. Passwords are stored only as a one-way hash.</p>
      <p><strong className="text-text-primary">Health information.</strong> Your dosha questionnaire answers and results; information your practitioner records, such as condition, height, weight, blood pressure, heart rate, allergies, medications, lifestyle notes and clinical notes; your weekly diet and exercise plans; and the meals and exercise you mark as done each day.</p>
      <p><strong className="text-text-primary">Files and messages.</strong> Medical reports you upload, and messages and files exchanged in chat with your practitioner.</p>
      <p><strong className="text-text-primary">Food photos.</strong> If you use the food scanner, the photo you choose is sent for analysis. We do not save the photo itself.</p>
      <p><strong className="text-text-primary">Assistant messages.</strong> What you type to the in-app assistant, along with your first name, dosha and age if they are on your profile.</p>
      <p><strong className="text-text-primary">Updates list.</strong> Your email address, if you subscribe to project updates.</p>
      <p>We do not use advertising or analytics trackers. Your browser keeps your sign-in token and theme choice in local storage on your device; we do not set cookies.</p>
    </Section>

    <Section id="use" title="How we use it">
      <p>To run your account; to let you and your practitioner build, review and follow diet plans; to calculate dosha results and plan suggestions; to deliver messages, appointments and reports between you and your practitioner; to send password-reset and update emails you ask for; and to keep the service secure. We do not sell your information or use it for advertising.</p>
    </Section>

    <Section id="third-parties" title="Services we rely on">
      <p>Some features send data to outside services, which process it on our behalf:</p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li><strong className="text-text-primary">Groq</strong> receives your age, weight, height, gender, activity level, goal and dosha to draft a weekly plan, and receives assistant messages. It does not receive your name or contact details for plan drafting.</li>
        <li><strong className="text-text-primary">Google (Gemini API)</strong> receives food photos you scan, and plan-adjustment summaries built from your daily logs.</li>
        <li><strong className="text-text-primary">Google (Gmail)</strong> sends password-reset and update emails.</li>
        <li><strong className="text-text-primary">MongoDB Atlas</strong> stores the database.</li>
        <li><strong className="text-text-primary">Render</strong> runs the server, and <strong className="text-text-primary">Vercel</strong> serves the website.</li>
      </ul>
      <p>Each provider handles data under its own terms and privacy policy.</p>
    </Section>

    <Section id="storage" title="Where data is stored">
      <p>The database is hosted by MongoDB Atlas in Mumbai, India. The server runs on Render in Singapore. Uploaded reports are stored on the server. Some of the services above may process data in other countries.</p>
    </Section>

    <Section id="sharing" title="Who can see your data">
      <p>Your health information, plans, logs, reports and messages are visible to you and to the practitioner who has linked your account. A clinic administrator can see the details of practitioners registered under their clinic, not patient records. We do not share your information with anyone else unless the law requires it.</p>
    </Section>

    <Section id="retention" title="How long we keep it">
      <p>We keep your information while your account is active. If you ask us to delete your account, we delete your account details, records, plans, logs and uploaded files, except where we must keep something by law.</p>
    </Section>

    <Section id="rights" title="Your choices and rights">
      <p>You can ask to see the information we hold about you, have it corrected, or have your account deleted, and you can withdraw consent for optional features such as the food scanner by not using them. Indian residents have these rights under the Digital Personal Data Protection Act, 2023. To make a request, contact <Contact />.</p>
    </Section>

    <Section id="security" title="Security">
      <p>Passwords are hashed, every protected request needs a signed sign-in token, and each patient's records can only be read by that patient and their practitioner. No system is completely secure, so please use a strong password and keep it to yourself.</p>
    </Section>

    <Section id="children" title="Children">
      <p>{SITE.name} is meant for adults. Anyone under 18 should use it only with a parent or guardian, through a practitioner.</p>
    </Section>

    <Section id="changes" title="Changes to this policy">
      <p>If we change this policy, we will update the date at the top of this page. Significant changes will be shown in the app.</p>
    </Section>

    <Section id="contact" title="Contact">
      <p>Questions about privacy can be sent to <Contact />.</p>
    </Section>
  </LegalLayout>
);

export default PrivacyPolicy;
