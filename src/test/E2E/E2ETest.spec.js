const chai = require('chai')
const expect = chai.expect
const { test } = require('@playwright/test');
const { HomePage } = require('../POM/HomePage');
const { AddNewShipmentPage } = require('../POM/AddNewShipmentPage');

test.beforeEach(async ({ page }) => {
  
  await page.goto('https://nswfoodauthority-oyster-shipments-dev.app.oneblink.io/');
})

test('Website Availability ', async ({ page }) => {
  const pageTitle = await page.title();
  expect(pageTitle).to.be.equal('Oyster Shipments');
});


test('Check Add New Shipment Page 1', async ({ page }) => {  
  const homePage = new HomePage(page);
  const addNewShipmentPage = new AddNewShipmentPage(page);
  await homePage.goToAddNewShipmentPage();
  await addNewShipmentPage.verifyPageIsOpen();
});

test('validate add new shipment scenario', async ({ page }) => {  
  const homePage = new HomePage(page);
  const addNewShipmentPage = new AddNewShipmentPage(page);
  await homePage.goToAddNewShipmentPage();
  await addNewShipmentPage.addNewShipment();
});


