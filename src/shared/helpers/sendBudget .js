// require sendEmail
const { sendEmail } = require('./emailSender');
const ejs = require('ejs');

// Send a bill to an email given
export function sendBudget(email, bill) {
  let subject = "Survey Bill";
  let date = new Date();
  let until = new Date(date);
  until.setDate(result.getDate() + 30);
  date = date.getDate() + '/' + ( date.getMonth() + 1 ) + '/' + date.getFullYear();
  until = until.getDate() + '/' + ( until.getMonth() + 1 ) + '/' + until.getFullYear();
  let html = ejs.render('budgetEmail', {bill: bill, date: this.date, until: this.until});
  sendEmail(email, subject, html);
  return html;
}