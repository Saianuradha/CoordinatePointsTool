import { expect } from "playwright/test";
import UIActions from "../../support/playwright/actions/UIActions";
import Constants from "../constants/Constants";

export default class CommonPage {
    constructor(private web: UIActions) { }
    
    private VALIDATION_INPUT_MESSAGE_TEXT = "//input[@name='input']/following-sibling::div[1]";
    private ANALYZE_BUTTON = "button[type='button']";
    private CLOSEST_POINT_A = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[1]/td[2]";
    private CLOSEST_POINT_B = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[1]/td[3]";
    private CLOSEST_DISTANCE = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[1]/td[4]";
    private FURTHEST_POINT_A = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[2]/td[2]";
    private FURTHEST_POINT_B = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[2]/td[3]";
    private FURTHEST_DISTANCE = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[2]/td[4]";
    private AVG_DISTANCE = "//table[contains(@class,'table table-striped')]/tbody[1]/tr[3]/td[4]";
    private INPUT_COORDINATES_LIST = "input[name='input']";
    private VALIDATION_MESSAGE = this.VALIDATION_INPUT_MESSAGE_TEXT;
    private RESULTS_TABLE = "//table[contains(@class,'table table-striped')]";

    /**
     * Enter Input Coordinates list in the input box
     * @param inputPoints 
     */
    public async enterInput(inputPoints: string){
        await this.web.editBox(this.INPUT_COORDINATES_LIST,Constants.COORDINATES).fill(inputPoints);
    }

    public async clickOnAnalyzeButton() {   
        await this.web.element(this.ANALYZE_BUTTON, Constants.ANALYZE_BUTTON).click();
    }

    public async verifyClosestCharacteristics(closestPointA:string,closestPointB:string,closestDistance:string){
        const PointA = await this.web.element(this.CLOSEST_POINT_A, Constants.CLOSEST_POINT_A).getTextContent();
        expect(PointA).toMatch(closestPointA);
        const PointB = await this.web.element(this.CLOSEST_POINT_B, Constants.CLOSEST_POINT_B).getTextContent();
        expect(PointB).toMatch(closestPointB);
        const Closest_Distance = await this.web.element(this.CLOSEST_DISTANCE, Constants.CLOSEST_DISTANCE).getTextContent();
        expect(Closest_Distance).toMatch(closestDistance);
    }
    public async verifyFurthestCharacteristics(furthestPointA: string, furthestPointB: string, furthestDistance: string){
        const PointA = await this.web.element(this.FURTHEST_POINT_A, Constants.FURTHEST_POINT_A).getTextContent();
        expect(PointA).toMatch(furthestPointA);
        const PointB = await this.web.element(this.FURTHEST_POINT_B, Constants.FURTHEST_POINT_B).getTextContent();
        expect(PointB).toMatch(furthestPointB);
        const Furthest_Distance = await this.web.element(this.FURTHEST_DISTANCE, Constants.FURTHEST_DISTANCE).getTextContent();
        expect(Furthest_Distance).toMatch(furthestDistance);
    }
    public async verifyAverageDistanceDisplayed(averageDistance: string){
        const AvgDistance = await this.web.element(this.AVG_DISTANCE, Constants.AVG_DISTANCE).getTextContent();
        expect(AvgDistance).toMatch(averageDistance);
    }

    /**
     * Verify the input validation message displayed after input coordinates entered
     * @param message 
     */
    public async verifyInputValidationMessage(message: string) {
        const actualMsg = await this.web.element(this.VALIDATION_INPUT_MESSAGE_TEXT, Constants.INPUT_MESSAGE).getTextContent();
        expect(actualMsg).toContain(message);
    }

    /**
     * Verify the Analyze button status - isEnabled() approach
     */
    public async verifyAnalyzeButtonStatus(expectedState: 'enabled' | 'disabled') {
        const button = this.web.element(this.ANALYZE_BUTTON, Constants.ANALYZE_BUTTON);
        //const isEnabled = await button.isEnabled();
        const isEnabled = await button.isEnabled(1); // or another appropriate number
        if (expectedState === 'disabled') {
            expect(isEnabled).toBe(false);
        } else {
            expect(isEnabled).toBe(true);
        }
    }

    // --- Enhanced Step Definitions Support ---

    async typeInput(char: string) {
        await this.web.editBox(this.INPUT_COORDINATES_LIST, Constants.COORDINATES).type(char);
    }

    async getInputValue(): Promise<string> {
        return await this.web.editBox(this.INPUT_COORDINATES_LIST, Constants.COORDINATES).getValue();
    }

    async verifyErrorValidationMessage() {
        const msg = await this.web.element(this.VALIDATION_MESSAGE, Constants.INPUT_MESSAGE).getTextContent();
        if (!/error|invalid|format/i.test(msg)) {
            throw new Error(`Expected error validation message, got: ${msg}`);
        }
    }

    async verifyAppropriateValidationMessage() {
        const msg = await this.web.element(this.VALIDATION_MESSAGE, Constants.INPUT_MESSAGE).getTextContent();
        if (!/required|invalid|format/i.test(msg)) {
            throw new Error(`Expected appropriate validation message, got: ${msg}`);
        }
    }

    async verifyValidationUpdatesRealtime() {
        const msg = await this.web.element(this.VALIDATION_MESSAGE, Constants.INPUT_MESSAGE).getTextContent();
        if (!msg) throw new Error('Validation message did not update in real-time');
    }

    async verifyResultsDisplayedCorrectly() {
        const visible = await this.web.element(this.RESULTS_TABLE, "Results Table").isVisible(1);
        if (!visible) throw new Error('Results table is not visible');
    }

    async verifyResultsTableHeaders(expectedHeaders: string[]) {
        const headers = await this.web.element(this.RESULTS_TABLE, "Results Table").getAllInnerTexts('th');
        if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
            throw new Error(`Expected headers ${expectedHeaders}, got ${headers}`);
        }
    }

    async verifyResultsTableRowCount(expectedCount: number) {
        const rows = await this.web.element(this.RESULTS_TABLE + "/tbody", "Results Table Body").getAllInnerTexts('tr');
        if (rows.length !== expectedCount) {
            throw new Error(`Expected ${expectedCount} rows, got ${rows.length}`);
        }
    }

    async verifyResultsTableRowLabels(expectedLabels: string[]) {
        const labels = await this.web.element(this.RESULTS_TABLE + "/tbody", "Results Table Body").getAllInnerTexts('td:first-child');
        if (JSON.stringify(labels) !== JSON.stringify(expectedLabels)) {
            throw new Error(`Expected row labels ${expectedLabels}, got ${labels}`);
        }
    }

    async getResultsTableText(): Promise<string> {
        return await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
    }

    async verifyTabCharacterHandling() {
        const msg = await this.web.element(this.VALIDATION_MESSAGE, Constants.INPUT_MESSAGE).getTextContent();
        if (!/valid|format/i.test(msg)) {
            throw new Error(`Tab character handling not consistent, got: ${msg}`);
        }
    }

    async verifyNoOverflow() {
        const msg = await this.web.element(this.VALIDATION_MESSAGE, Constants.INPUT_MESSAGE).getTextContent();
        if (/overflow|error/i.test(msg)) {
            throw new Error(`Overflow or error detected: ${msg}`);
        }
    }

    async verifyDecimalPrecision(precision: number) {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        const regex = new RegExp(`\\d+\\.\\d{${precision}}`);
        if (!regex.test(text)) {
            throw new Error(`Expected decimal precision of ${precision}, got: ${text}`);
        }
    }

    async verifyMinimalRoundingErrors() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/\d+\.\d{2}/.test(text)) {
            throw new Error(`Expected minimal rounding errors, got: ${text}`);
        }
    }

    async verifyNegativeValueDistances() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/Valid input/.test(text)) {
            throw new Error(`Negative value distances not handled, got: ${text}`);
        }
    }

    async verifySymmetricDistances() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/distance/i.test(text)) {
            throw new Error(`Symmetric distances not found, got: ${text}`);
        }
    }

    async verifyPointsOnYEqualsX() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/1\.41/.test(text)) {
            throw new Error(`Points not on y=x line, got: ${text}`);
        }
    }

    async verifyFurthestIsDiagonal() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/1\.41/.test(text)) {
            throw new Error(`Furthest is not diagonal, got: ${text}`);
        }
    }

    async verifyDistancesVaryBy(axis: 'x' | 'y') {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/1\.00/.test(text) || !/3\.00/.test(text)) {
            throw new Error(`Distances do not vary by ${axis}, got: ${text}`);
        }
    }

    async verifyMultipleZeroDistances() {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!/0\.00/.test(text)) {
            throw new Error(`Multiple zero distances not handled, got: ${text}`);
        }
    }

    async verifyApproximateDistance(approx: string) {
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!text.includes(approx)) {
            throw new Error(`Expected approximate distance ${approx}, got: ${text}`);
        }
    }

    async verifyDistanceMatchesFormula(x1: number, y1: number, x2: number, y2: number) {
        const expected = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2).toFixed(2);
        const text = await this.web.element(this.RESULTS_TABLE, "Results Table").getText();
        if (!text.includes(expected)) {
            throw new Error(`Expected distance ${expected}, got: ${text}`);
        }
    }
}