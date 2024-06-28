import { Given, Then, When } from "@cucumber/cucumber";
import HomePage from "../pages/HomePage";
import CommonPage from "../pages/CommonPage";

Given('I navigate to the coordinate points tool', async function () {
    await new HomePage(this.web).navigateToHomePage();
  });

When('I enter {string} into the input box', async function (inputPoints: string) {
    await new CommonPage(this.web).enterInput(inputPoints);
});

When('I should see {string} validation message', async function (message:string) {
  await new CommonPage(this.web).verifyInputValidationMessage(message);
});

When('I click the Analyze button', async function () {
  await new CommonPage(this.web).clickOnAnalyzeButton();
  });

Then('I should see Closest: {string}, {string} and {string} in the output', async function (closestPointA: string, closestPointB: string, closestDistance: string) {
  await new CommonPage(this.web).verifyClosestCharacteristics(closestPointA,closestPointB,closestDistance)
    
  });


Then('I should see Furthest: {string}, {string} and {string} in the output', async function (furthestPointA: string, furthestPointB: string, furthestDistance: string) {
    await new CommonPage(this.web).verifyFurthestCharacteristics(furthestPointA,furthestPointB,furthestDistance)
});

Then('I should see Average distance between all points: {string} in the output', async function (averageDistance: string) {
  await new CommonPage(this.web).verifyAverageDistanceDisplayed(averageDistance);
});
