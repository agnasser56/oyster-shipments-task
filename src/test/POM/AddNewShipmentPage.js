const { expect } = require('@playwright/test');
const chai = require('chai')
const verify = chai.expect
class AddNewShipmentPage {
    /**
     * @param {import('playwright').Page} page 
     */
    constructor(page) {
        this.page = page;
        this.lblSelectType = page.locator("xpath=//h4[text()='Select type']");
        this.rdbtnShipmentTypeStock = page.getByLabel('Stock');
        this.rdbtnShipmentTypeInfra = page.getByLabel('Infrastructure');
        //catching material toggle
        this.ddlAquaculturePermit = page.getByRole('combobox', { name: 'Select the origin Aquaculture permit*' });
        this.rdbtnShipmentOriginTypeLease = page.getByText('Origin Aquaculture lease');
        this.rdbtnShipmentOriginTypeEstuary = page.getByText('Origin estuary (within NSW)');
        this.ddlOriginAqualcultureLease = page.getByRole('combobox', { name: 'Origin Aquaculture lease*' });
        this.ddlLocationWithinOriginEstuary = page.getByRole('combobox', { name: 'Location within origin estuary*' });
        this.btnNext = page.getByRole('button', { name: 'Next keyboard_arrow_right' });
        //Intersatte toggle
        this.txtReceiverBusinessName = page.getByLabel('Receiver Business Name');
        this.ddlState = page.getByRole('combobox', { name: 'State*' });

        this.chkAboveInfoIsCorrect = page.getByText('I declare that the above information is true.');
        this.chkUnderstandInfoWillBeUsed = page.getByText('I understand that the information I have provided will be stored and usd in acco');
        this.chkAllNecessaryApprovalsAreReceived = page.getByText('I declare that all the necessary approvals to receive this shipment have been ob');
        this.chkConfirmAllInfraCleaned = page.locator('id=Declare_Biosecurity_Yes');
        this.lnkPrivacyPolicyNotice = page.getByRole('link', { name: 'Privacy Policy Notice' });
        this.txtMovementNotes = page.getByLabel('Movement Notes');
        this.btnAddAttachment = page.getByRole('button', { name: 'add' });
        this.btnSubmit = page.getByRole('button', { name: 'Submit' });
        this.popupStatus = page.locator('xpath=//div[@class="modal-card"]');
        this.popupMessage = page.locator('xpath=//div[@class="modal-card"]/section/p');        
        this.btnOkay = page.getByRole('button', { name: 'Okay' });
        this.tglIncludeCatchingMaterialYes = page.locator(`xpath=//div[@data-ob-name='catching_material']/descendant::button[text()='Yes']`);
        this.tglIncludeCatchingMaterialNo = page.locator(`xpath=//div[@data-ob-name='catching_material']/descendant::button[text()='No']`);
        this.tglShipingInterStateYes = page.locator(`xpath=//div[@data-ob-name='Interstate']/descendant::button[text()='Yes']`);
        this.tglShipingInterStateNo = page.locator(`xpath=//div[@data-ob-name='Interstate']/descendant::button[text()='No']`);

    }

    async verifyPageIsOpen() {
        await expect(this.rdbtnShipmentTypeStock).toBeVisible();
    }

    async tglIncludeCatchingMaterial(answer) {
        return this.page.locator(`xpath=//div[@data-ob-name='catching_material']/descendant::button[text()='${answer}']`);
    }

    async tglShipingInterState(answer) {
        return page.locator(`xpath=//div[@data-ob-name='Interstate']/descendant::button[text()='${answer}']`);
    }

    async fillOriginTabData() {
        await this.rdbtnShipmentTypeInfra.check();
        await this.tglIncludeCatchingMaterialYes.click();
        await this.ddlAquaculturePermit.selectOption('AP1228');
        await this.rdbtnShipmentOriginTypeLease.click();
        await this.ddlOriginAqualcultureLease.selectOption('AL11/123 (Bega River)');
    }

    async goToNextPage()
    {
        await this.btnNext.click();
    }

    async fillDestinationTabData() {
        await this.tglShipingInterStateYes.click();
        await this.ddlState.selectOption('QLD');
        await this.txtReceiverBusinessName.fill('Oyster King');      
    }

    async fillReviewTabData() {
        await this.chkAboveInfoIsCorrect.click();
        await this.chkUnderstandInfoWillBeUsed.click();
        await this.chkAllNecessaryApprovalsAreReceived.click();        
        await this.txtMovementNotes.fill('Movement notes');        
    }

    async fillAdditionalDeclarationTabData() {
        await this.chkConfirmAllInfraCleaned.click();
        await this.btnSubmit.click();        
    }

    async verifySuccess() {        
        await expect(this.popupStatus).toBeVisible();
        var successMsg = await this.popupMessage.textContent();
        verify(successMsg).to.include('Stop! This shipment is not allowed');
        await this.btnOkay.click();        
    }

    async addNewShipment() {
        await this.fillOriginTabData();
        await this.goToNextPage();
        await this.fillDestinationTabData();
        await this.goToNextPage();
        await this.fillReviewTabData();
        await this.goToNextPage();
        await this.fillAdditionalDeclarationTabData();
        await this.verifySuccess();

    }
}
module.exports = { AddNewShipmentPage };