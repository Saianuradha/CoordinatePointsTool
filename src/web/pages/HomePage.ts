import UIActions from "../../support/playwright/actions/UIActions";


export default class HomePage {
    constructor(private web: UIActions) { }
    /**
     * async navigateToHomePage
     */
    public async navigateToHomePage() {
        const baseUrl = process.env.BASE_URL ?? 'https://default-url.com'; 
        await this.web.goto(baseUrl, "Home page");
    }
}    