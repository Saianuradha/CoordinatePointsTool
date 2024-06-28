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

}