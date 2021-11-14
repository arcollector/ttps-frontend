// require sendEmail
const { sendEmail } = require('./emailSender');
const ejs = require('ejs');

// Send a bill to an email given
export function sendConsent(email, consent) {
  let subject = "Informed Consent";
  let html = ejs.render('consentEmail', {consent: this.consent});
  sendEmail(email, subject, html);
}