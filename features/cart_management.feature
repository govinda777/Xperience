Feature: Cart Management
  As a user
  I want to manage items in my shopping cart
  So that I can purchase mentoring plans

  Background:
    Given I am on the Xperience website
    And I have a clean cart

  Scenario: Adding a plan to empty cart
    Given I am viewing the plans page
    When I select the "Essencial" plan
    And I click "Add to Cart"
    Then the plan should be added to my cart
    And the cart should show 1 item
    And the cart total should be "R$ 3.000,00"

  Scenario: Adding multiple different plans
    Given I am viewing the plans page
    When I add the "Start" plan to cart
    And I add the "Essencial" plan to cart
    Then my cart should contain 2 different items
    And the cart total should be "R$ 4.500,00"

  Scenario: Adding the same plan multiple times
    Given I have the "Essencial" plan in my cart
    When I add the "Essencial" plan again
    Then the cart should show 1 unique item
    And the quantity should be 2
    And the cart total should be "R$ 6.000,00"

  Scenario: Updating item quantity
    Given I have the "Essencial" plan in my cart with quantity 1
    When I increase the quantity to 3
    Then the item quantity should be 3
    And the cart total should be "R$ 9.000,00"

  Scenario: Removing item from cart
    Given I have 2 different plans in my cart
    When I remove the "Start" plan
    Then my cart should contain 1 item
    And the "Start" plan should not be in the cart

  Scenario: Clearing entire cart
    Given I have multiple plans in my cart
    When I click "Clear Cart"
    Then my cart should be empty
    And the cart total should be "R$ 0,00"

  Scenario: Cart persistence across sessions
    Given I have plans in my cart
    When I close and reopen the browser
    Then my cart should still contain the same items
    And the cart total should be preserved

  Scenario: Viewing cart summary
    Given I have the "Essencial" plan with quantity 2 in my cart
    And I have the "Start" plan with quantity 1 in my cart
    When I view the cart summary
    Then I should see:
      | Item      | Quantity | Unit Price | Total     |
      | Essencial | 2        | R$ 3.000   | R$ 6.000  |
      | Start     | 1        | R$ 1.500   | R$ 1.500  |
    And the subtotal should be "R$ 7.500,00"
    And the final total should be "R$ 7.500,00"

  Scenario: Applying discount to cart item
    Given I have a plan with 10% discount in my cart
    When I view the cart summary
    Then I should see the original price
    And I should see the discount amount
    And I should see the final discounted price

  Scenario: Cart validation with maximum limits
    Given I try to add more than 99 of the same plan
    Then I should see an error message "Maximum quantity exceeded"
    And the quantity should remain at 99

  Scenario: Empty cart checkout attempt
    Given my cart is empty
    When I try to proceed to checkout
    Then I should see "Your cart is empty" message
    And I should see a "View Plans" button
    And the checkout button should be disabled
