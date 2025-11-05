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

 Then('the Analyze button should be {word}', async function (state: string) {
  const expectedState = state.toLowerCase() as 'enabled' | 'disabled';
  await new CommonPage(this.web).verifyAnalyzeButtonStatus(expectedState);
});

// Add to coordinatePointsSteps.ts

When('I clear the input box', async function () {
  await new CommonPage(this.web).enterInput('');
});

When('I clear and enter {string}', async function (value: string) {
  await new CommonPage(this.web).enterInput('');
  await new CommonPage(this.web).enterInput(value);
});

When('I start typing {string} into the input box', async function (value: string) {
  // Simulate typing character by character
  for (const char of value) {
    await new CommonPage(this.web).typeInput(char);
  }
});

When('I continue typing {string}', async function (value: string) {
  for (const char of value) {
    await new CommonPage(this.web).typeInput(char);
  }
});

When('I remove {string} from the input', async function (value: string) {
  const current = await new CommonPage(this.web).getInputValue();
  const updated = current.replace(value, '').trim();
  await new CommonPage(this.web).enterInput(updated);
});

When('the input box is empty', async function () {
  await new CommonPage(this.web).enterInput('');
});

Then('I should see error validation message', async function () {
  await new CommonPage(this.web).verifyErrorValidationMessage();
});

Then('I should see appropriate validation message', async function () {
  await new CommonPage(this.web).verifyAppropriateValidationMessage();
});

Then('the Analyze button should be enabled', async function () {
  await new CommonPage(this.web).verifyAnalyzeButtonStatus('enabled');
});

Then('the Analyze button should be disabled', async function () {
  await new CommonPage(this.web).verifyAnalyzeButtonStatus('disabled');
});

Then('Analyze button should be enabled', async function () {
  await new CommonPage(this.web).verifyAnalyzeButtonStatus('enabled');
});

Then('Analyze button should be disabled', async function () {
  await new CommonPage(this.web).verifyAnalyzeButtonStatus('disabled');
});

Then('validation should update in real-time', async function () {
  await new CommonPage(this.web).verifyValidationUpdatesRealtime();
});

Then('results should be displayed correctly', async function () {
  await new CommonPage(this.web).verifyResultsDisplayedCorrectly();
});

Then('results table should have column headers: {string}, {string}, {string}, {string}', async function (a: string, b: string, c: string, d: string) {
  await new CommonPage(this.web).verifyResultsTableHeaders([a, b, c, d]);
});

Then('table should have exactly {int} data rows', async function (rowCount: number) {
  await new CommonPage(this.web).verifyResultsTableRowCount(rowCount);
});

Then('rows should be labeled: {string}, {string}, {string}', async function (a: string, b: string, c: string) {
  await new CommonPage(this.web).verifyResultsTableRowLabels([a, b, c]);
});

When('I store the results', async function () {
  this.storedResults = await new CommonPage(this.web).getResultsTableText();
});

Then('results should remain identical to stored results', async function () {
  const current = await new CommonPage(this.web).getResultsTableText();
  if (this.storedResults !== current) {
    throw new Error('Results table content changed after re-analyze');
  }
});

Then('system should handle or reject tab characters consistently', async function () {
  await new CommonPage(this.web).verifyTabCharacterHandling();
});

Then('system should not overflow', async function () {
  await new CommonPage(this.web).verifyNoOverflow();
});

Then('distances should be calculated with 2 decimal precision', async function () {
  await new CommonPage(this.web).verifyDecimalPrecision(2);
});

Then('results should display correctly with minimal rounding errors', async function () {
  await new CommonPage(this.web).verifyMinimalRoundingErrors();
});

Then('distances should be calculated correctly with negative values', async function () {
  await new CommonPage(this.web).verifyNegativeValueDistances();
});

Then('I should see symmetric distance calculations', async function () {
  await new CommonPage(this.web).verifySymmetricDistances();
});

Then('all points should lie on y=x line', async function () {
  await new CommonPage(this.web).verifyPointsOnYEqualsX();
});

Then('furthest should be diagonal distance', async function () {
  await new CommonPage(this.web).verifyFurthestIsDiagonal();
});

Then('distances should only vary by X coordinate', async function () {
  await new CommonPage(this.web).verifyDistancesVaryBy('x');
});

Then('distances should only vary by Y coordinate', async function () {
  await new CommonPage(this.web).verifyDistancesVaryBy('y');
});

Then('system should handle multiple zero distances correctly', async function () {
  await new CommonPage(this.web).verifyMultipleZeroDistances();
});

Then('distance should be approximately {string}', async function (approx: string) {
  await new CommonPage(this.web).verifyApproximateDistance(approx);
});

Then(/^distance should match formula sqrt\(\(1-0\)\^2 \+ \(1-0\)\^2\)$/, async function () {
    await new CommonPage(this.web).verifyDistanceMatchesFormula(1, 0, 1, 0);
});
