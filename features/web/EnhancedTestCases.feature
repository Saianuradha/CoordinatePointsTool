Feature: Coordinate Points Tool

Background:
  Given I navigate to the coordinate points tool

# ============================================================
# VALID INPUT SCENARIOS
# ============================================================

Scenario Outline: Valid input with multiple points
  When I enter "<inputPoints>" into the input box
  Then I should see "Valid input" validation message
  When I click the Analyze button
  Then I should see Closest: "<closestPointA>", "<closestPointB>" and "<closestDistance>" in the output
  And I should see Furthest: "<furthestPointA>", "<furthestPointB>" and "<furthestDistance>" in the output
  And I should see Average distance between all points: "<averageDistance>" in the output

Examples:
  | inputPoints             | closestPointA | closestPointB | closestDistance | furthestPointA | furthestPointB | furthestDistance | averageDistance |
  | 0.0,1.0 2.0,3.0 4.0,5.0 | 0.0,1.0       | 2.0,3.0       | 2.83            | 0.0,1.0        | 4.0,5.0        | 5.66             | 3.77            |
  | 0.0,0.0 1.0,1.0         | 0.0,0.0       | 1.0,1.0       | 1.41            | 0.0,0.0        | 1.0,1.0        | 1.41             | 1.41            |
  | 1.0,1.0 1.0,1.0 2.0,2.0 | 1.0,1.0       | 1.0,1.0       | 0.00            | 1.0,1.0        | 2.0,2.0        | 1.41             | 0.94            |
  | 1.0,1.0 1.0,1.0 1.0,1.0 | 1.0,1.0       | 1.0,1.0       | 0.00            | 1.0,1.0        | 1.0,1.0        | 0.00             | 0.00            |
  | -1.0,-1.0 1.0,1.0 -2.0,-2.0 2.0,2.0     | -1.0,-1.0     |  -2.0,-2.0      | 1.41           | -2.0,-2.0      | 2.0,2.0          | 5.66             | 3.30            |
  | 0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0 | 0.0,0.0  | 1.0,1.0        | 1.41              | 0.0,0.0        | 9.0,9.0        | 12.73             | 5.19            |

# ============================================================
# DISTANCE CALCULATION ACCURACY
# ============================================================

Scenario: Pythagorean triple distance calculation
  When I enter "0.0,0.0 3.0,4.0" into the input box
  Then I should see "Valid input" validation message
  When I click the Analyze button
  Then I should see Closest distance "5.00" in the output
  And I should see Furthest distance "5.00" in the output
  And I should see Average distance "5.00" in the output

Scenario: Distance calculation with two points
  When I enter "0.0,0.0 1.0,1.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "1.41" in the output
  And distance should match formula sqrt((1-0)^2 + (1-0)^2)

# ============================================================
# INVALID FORMAT SCENARIOS
# ============================================================

Scenario: Invalid input format with mixed valid and invalid data
  When I enter "0.0,0.0 1.0,1.0 invalid 2.0,2.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Alphabetic characters instead of numbers
  When I enter "a,b c,d e,f" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Special characters in input
  When I enter "@,# $,% ^,&" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Mixed numbers and emojis
  When I enter "1.0,2.0 😀,😀 3.0,4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Numbers with alphabetic suffixes
  When I enter "1.0a,2.0b 3.0,4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

# ============================================================
# INCOMPLETE COORDINATE PAIRS
# ============================================================

Scenario: Missing Y coordinate
  When I enter "1.0, 2.0,3.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Missing X coordinate
  When I enter ",1.0 ,2.0 3.0,4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Only X coordinates without Y
  When I enter "1.0 2.0 3.0 4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Trailing comma after coordinate
  When I enter "1.0,2.0 3.0,4.0," into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

# ============================================================
# SPECIAL CHARACTERS & DELIMITERS
# ============================================================

Scenario: Extra commas between coordinates
  When I enter "1.0,,2.0 3.0,4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Semicolons instead of commas
  When I enter "1.0;2.0 3.0;4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: Parentheses around coordinates
  When I enter "(1.0,2.0) (3.0,4.0)" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

Scenario: No spaces between coordinate pairs
  When I enter "1.0,2.03.0,4.0" into the input box
  Then I should see "Please make sure the input follows the format required" validation message
  And the Analyze button should be disabled

# ============================================================
# WHITESPACE HANDLING
# ============================================================

@bug
Scenario: Multiple spaces between points
  When I enter "1.0,2.0  3.0,4.0  5.0,6.0" into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled
  # KNOWN BUG: Currently shows format error instead of accepting

Scenario: Leading and trailing spaces
  When I enter " 1.0,2.0 3.0,4.0 5.0,6.0 " into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled

Scenario: Tab characters between points
  When I enter "1.0,2.0\t3.0,4.0\t5.0,6.0" into the input box
  Then I should see appropriate validation message
  And the system should handle or reject tab characters consistently

# ============================================================
# MINIMUM AND MAXIMUM POINTS VALIDATION
# ============================================================

Scenario: With minimum points - single point
  When I enter "9.0,1.0" into the input box
  Then I should see "Please enter more than 1 point" validation message
  And the Analyze button should be disabled

Scenario: Exactly two points - boundary minimum
  When I enter "1.0,1.0 2.0,2.0" into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled

Scenario: Exactly ten points - boundary maximum
  When I enter "0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0" into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled
  When I click the Analyze button
  Then results should be displayed correctly

@bug @critical
Scenario: More than 10 pairs
  When I enter "0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0 10.0,10.0" into the input box
  Then I should see "Too many coordinate points. Maximum allowed is 10 pairs" validation message
  And the Analyze button should be disabled
  # KNOWN BUG: Currently accepts >10 points instead of rejecting

# ============================================================
# EDGE CASES - MATHEMATICAL
# ============================================================

Scenario: All points at origin
  When I enter "0.0,0.0 0.0,0.0 0.0,0.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "0.00" in the output
  And I should see Furthest distance "0.00" in the output
  And I should see Average distance "0.00" in the output

Scenario: Three identical points
  When I enter "5.0,5.0 5.0,5.0 5.0,5.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "0.00" in the output
  And I should see Furthest distance "0.00" in the output
  And I should see Average distance "0.00" in the output

Scenario: Multiple duplicate pairs
  When I enter "1.0,1.0 1.0,1.0 2.0,2.0 2.0,2.0 3.0,3.0 3.0,3.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "0.00" in the output
  And system should handle multiple zero distances correctly

Scenario: Collinear points on horizontal line
  When I enter "0.0,5.0 1.0,5.0 2.0,5.0 3.0,5.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "1.00" in the output
  And I should see Furthest distance "3.00" in the output
  And distances should only vary by X coordinate

Scenario: Collinear points on vertical line
  When I enter "5.0,0.0 5.0,1.0 5.0,2.0 5.0,3.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "1.00" in the output
  And I should see Furthest distance "3.00" in the output
  And distances should only vary by Y coordinate

Scenario: Collinear points on diagonal
  When I enter "0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "1.41" in the output
  And all points should lie on y=x line

Scenario: Square pattern
  When I enter "0.0,0.0 1.0,0.0 1.0,1.0 0.0,1.0" into the input box
  And I click the Analyze button
  Then I should see Closest distance "1.00" in the output
  And I should see Furthest distance "1.41" in the output
  And furthest should be diagonal distance

# ============================================================
# NEGATIVE AND ZERO COORDINATES
# ============================================================

Scenario: All negative coordinates
  When I enter "-5.0,-5.0 -3.0,-3.0 -1.0,-1.0" into the input box
  And I click the Analyze button
  Then distances should be calculated correctly with negative values
  And I should see "Valid input" validation message

Scenario: Mix of positive, negative, and zero
  When I enter "-2.0,-2.0 0.0,0.0 2.0,2.0" into the input box
  And I click the Analyze button
  Then I should see symmetric distance calculations

Scenario: Negative X with positive Y
  When I enter "-1.0,1.0 -2.0,2.0 -3.0,3.0" into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled

Scenario: Positive X with negative Y
  When I enter "1.0,-1.0 2.0,-2.0 3.0,-3.0" into the input box
  Then I should see "Valid input" validation message
  And the Analyze button should be enabled

# ============================================================
# LARGE NUMBERS AND PRECISION
# ============================================================

Scenario: Very large coordinates
  When I enter "999.99,999.99 1000.00,1000.00" into the input box
  Then I should see "Valid input" validation message
  When I click the Analyze button
  Then distance calculations should handle large numbers correctly
  And I should see distance "0.01" in the output

Scenario: Maximum float values
  When I enter "9999999.99,9999999.99 9999999.98,9999999.98" into the input box
  Then I should see "Valid input" validation message
  And system should not overflow

Scenario: Mixed large and small values
  When I enter "0.001,0.001 1000.00,1000.00" into the input box
  And I click the Analyze button
  Then distance should be approximately "1414.21"

Scenario: High precision decimals
  When I enter "1.123456,2.987654 3.456789,4.123456" into the input box
  Then I should see "Valid input" validation message
  When I click the Analyze button
  Then distances should be calculated with 2 decimal precision

Scenario: Very small decimal values
  When I enter "0.001,0.001 0.002,0.002 0.003,0.003" into the input box
  Then I should see "Valid input" validation message
  When I click the Analyze button
  Then results should display correctly with minimal rounding errors

# ============================================================
# BUTTON STATE VALIDATION
# ============================================================

Scenario: Button disabled on page load
  Given I navigate to the coordinate points tool
  Then the Analyze button should be disabled
  And I should see "Input is required" message

Scenario: Button enabled with valid input
  When I enter "1.0,2.0 3.0,4.0" into the input box
  Then the Analyze button should be enabled

Scenario: Button disabled after clearing valid input
  When I enter "1.0,2.0 3.0,4.0" into the input box
  And I clear the input box
  Then the Analyze button should be disabled

Scenario: Button state changes with validation
  When I enter "invalid" into the input box
  Then the Analyze button should be disabled
  When I clear and enter "1.0,2.0 3.0,4.0"
  Then the Analyze button should be enabled

# ============================================================
# PROGRESSIVE INPUT AND ERROR RECOVERY
# ============================================================

Scenario: Real-time validation while typing
  When I start typing "1.0,2.0" into the input box
  Then validation should update in real-time
  When I continue typing " 3.0,4.0"
  Then I should see "Valid input" validation message

Scenario: Correcting invalid input to valid
  When I enter "invalid" into the input box
  Then I should see error validation message
  When I clear and enter "1.0,2.0 3.0,4.0"
  Then I should see "Valid input" validation message
  And Analyze button should be enabled

Scenario: Exceeding limit then correcting
  When I enter "0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0 10.0,10.0" into the input box
  Then I should see "Too many coordinate points. Maximum allowed is 10 pairs" validation message
  When I remove "10.0,10.0" from the input
  Then I should see "Valid input" validation message
  And Analyze button should be enabled

# ============================================================
# RESULTS TABLE VALIDATION
# ============================================================

Scenario: Results table structure verification
  When I enter "1.0,1.0 2.0,2.0 3.0,3.0" into the input box
  And I click the Analyze button
  Then results table should have column headers: "Characteristics", "Point A", "Point B", "Distance"
  And table should have exactly 3 data rows
  And rows should be labeled: "Closest", "Furthest", "Average distance between all points"

Scenario: Multiple analyze clicks consistency
  When I enter "1.0,2.0 3.0,4.0 5.0,6.0" into the input box
  And I click the Analyze button
  And I store the results
  And I click the Analyze button again
  Then results should remain identical to stored results

# ============================================================
# EMPTY AND NULL INPUT
# ============================================================

Scenario: Empty input field
  When the input box is empty
  Then I should see "Input is required" validation message
  And the Analyze button should be disabled

Scenario: Only whitespace in input
  When I enter "   " into the input box
  Then I should see appropriate validation message
  And the Analyze button should be disabled

# ============================================================
# TAGS FOR TEST ORGANIZATION
# ============================================================

# @smoke - Critical functionality tests
# @regression - All tests for regression suite
# @bug - Known bugs that need fixing
# @critical - High priority issues
# @validation - Input validation tests
# @calculation - Distance calculation tests
# @edge-case - Mathematical edge cases
# @ui - User interface behavior tests