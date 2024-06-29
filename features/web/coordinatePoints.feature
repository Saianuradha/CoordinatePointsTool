Feature: Coordinate Points Tool

Background:
  Given I navigate to the coordinate points tool

Scenario Outline: Valid input with multiple points
  When I enter "<inputPoints>" into the input box
  And I should see "Valid input" validation message
  And I click the Analyze button
  Then I should see Closest: "<closestPointA>", "<closestPointB>" and "<closestDistance>" in the output
  And I should see Furthest: "<furthestPointA>", "<furthestPointB>" and "<furthestDistance>" in the output
  And I should see Average distance between all points: "<averageDistance>" in the output

Examples:
  | inputPoints             | closestPointA | closestPointB | closestDistance | furthestPointA | furthestPointB | furthestDistance | averageDistance |
  | 0.0,1.0 2.0,3.0 4.0,5.0 | 0.0,1.0       | 2.0,3.0       | 2.83            | 0.0,1.0        | 4.0,5.0        | 5.66              | 3.77            |
  | 0.0,1.0 2.0,3.0 4.0,5.0 | 0.0,1.0       | 2.0,3.0       | 2.83            | 0.0,1.0        | 4.0,5.0        | 5.66              | 4.24            |
  | 0.0,0.0 1.0,1.0         | 0.0,0.0       | 1.0,1.0       | 1.41            | 0.0,0.0        | 1.0,1.0        | 1.41              | 1.41            |
  | 1.0,1.0 1.0,1.0 2.0,2.0 | 1.0,1.0       | 1.0,1.0       | 0.00            | 1.0,1.0        | 2.0,2.0        | 1.41              | 0.94            |
  | 1.0,1.0 1.0,1.0 1.0,1.0 | 1.0,1.0       | 1.0,1.0       | 0.00            | 1.0,1.0        | 1.0,1.0        | 0.00              | 0.00            |
  | -1.0,-1.0 1.0,1.0 -2.0,-2.0 2.0,2.0     | -1.0,-1.0     |  -2.0,-2.0      | 1.41           | -2.0,-2.0      | 2.0,2.0           | 5.66           | 3.30           |
  | 0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0 | 0.0,0.0  | 1.0,1.0        | 1.41              | 0.0,0.0        | 9.0,9.0        | 12.73              | 5.19            |

Scenario: Invalid input format
    When I enter "0.0,0.0 1.0,1.0 invalid 2.0,2.0" into the input box
    Then I should see "Please make sure the input follows the format required" validation message

  Scenario: More than 10 pairs
    When I enter "0.0,0.0 1.0,1.0 2.0,2.0 3.0,3.0 4.0,4.0 5.0,5.0 6.0,6.0 7.0,7.0 8.0,8.0 9.0,9.0 10.0,10.0" into the input box
    Then I should see "Too many coordinate points. Maximum allowed is 10 pairs" validation message
