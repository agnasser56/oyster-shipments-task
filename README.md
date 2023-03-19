# oyster-shipments-task
In this guide, I will show how the framework is designed
- E2E UI tests
- API tests

**E2E UI Tests**
- Designed to cover GUI testing end to end flows, it uses POM(Page object model) design pattern to keep clean code
- Playwright from microsoft is the UI automation tool used, fast, reliable and javascript based for easier development and maintenance of UI tests

**API Tests**
- Designed to cover lower level functionality and provide more coverage
- Supertest is the tool used to automate the API calls

**Exections & Assertions**
- Chai is the tool used for assertions along with built-in assertions from Playwright
- Mocha is the tool used for test execution along with Playwright execution command line

**To run**
- Clone the project to your local
- In root folder:
  - Open Powershell window(windoes), terminal (Mac), and type: npm init playwright@latest
  - Type: npm run test
- Test execution: https://user-images.githubusercontent.com/9838164/226178489-c67c57b4-6dfa-423c-a63b-003aff6de289.mp4
- Enjoy :)
- 
