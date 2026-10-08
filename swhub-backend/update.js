const fs = require('fs');
function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const rep of replacements) {
    content = content.split(rep.oldStr).join(rep.newStr);
  }
  fs.writeFileSync(filePath, content);
  console.log('Updated: ' + filePath);
}
replaceInFile('.env.example', [{oldStr: 'BREVO_SENDER_NAME=Balmitra', newStr: 'BREVO_SENDER_NAME=SW Hub'}]);
replaceInFile('package.json', [{oldStr: '\"name\": \"balmitra-backend\"', newStr: '\"name\": \"swhub-backend\"'}]);
replaceInFile('src/app.ts', [{oldStr: '\"Balmitra Backend API is Running dYs?\"', newStr: '\"SW Hub Backend API is Running dYs?\"'}]);
replaceInFile('src/config/brevo.ts', [
  {oldStr: 'name: \"Balmitra\"', newStr: 'name: \"SW Hub\"'},
  {oldStr: 'subject: \"Balmitra Email Verification OTP\"', newStr: 'subject: \"SW Hub Email Verification OTP\"'},
  {oldStr: '<h2>Welcome to Balmitra</h2>', newStr: '<h2>Welcome to SW Hub</h2>'},
  {oldStr: '<p>Balmitra Team</p>', newStr: '<p>SW Hub Team</p>'},
  {oldStr: 'name: \"Balmitra Admin\"', newStr: 'name: \"SW Hub Admin\"'},
  {oldStr: 'Balmitra Franchise Application', newStr: 'SW Hub Franchise Application'},
  {oldStr: 'Balmitra Franchise Enquiry System', newStr: 'SW Hub Franchise Enquiry System'}
]);
replaceInFile('src/config/env.ts', [{oldStr: 'BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || \"Balmitra\"', newStr: 'BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || \"SW Hub\"'}]);
replaceInFile('src/modules/settings/settings.service.ts', [
  {oldStr: 'websiteName: \"Balmitra\"', newStr: 'websiteName: \"SW Hub\"'},
  {oldStr: 'email: \"info@balmitra.com\"', newStr: 'email: \"info@swhub.com\"'}
]);
replaceInFile('src/modules/vendor-enquiry/vendor-enquiry.service.ts', [{oldStr: 'name: \"Balmitra Admin\"', newStr: 'name: \"SW Hub Admin\"'}]);
replaceInFile('src/server.ts', [{oldStr: 'dYs? Balmitra Backend Started', newStr: '🚀 SW Hub Backend Started'}]);
