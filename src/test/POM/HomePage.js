class HomePage {
    /**
     * @param {import('playwright').Page} page 
     */
    constructor(page) {
      this.page = page;
      this.btnAddNewShipment = page.locator('button', { hasText: 'Add New Shipment' });
      this.btnShipmentHistory = page.locator('button', { hasText: 'Shipment History' });
      this.btnCheckShipmentRestrictions = page.locator('button', { hasText: 'Check Shipment Restrictions' });
    }
    async goToAddNewShipmentPage() {
      await this.btnAddNewShipment.click();      
    }
  }
  module.exports = { HomePage };