Feature: User Navigation
  As a user
  I want to navigate through the website easily
  So that I can find information and services

  Background:
    Given I am on the Xperience website

  Scenario: Navigating to Home page
    When I click on the "Home" link
    Then I should be on the home page
    And I should see the hero section with "IA do empreendedor"
    And I should see the solutions section
    And I should see the community section

  Scenario: Navigating to Plans page
    When I click on the "Plans" link
    Then I should be on the plans page
    And I should see "Escolha o plano certo e veja seu negócio crescer"
    And I should see mentoring and incubator options
    And I should see plan comparison table

  Scenario: Navigating to About page
    When I click on the "About" link
    Then I should be on the about page
    And I should see information about Xperience
    And I should see the team section

  Scenario: Navigating to Contact page
    When I click on the "Contact" link
    Then I should be on the contact page
    And I should see the contact form
    And I should see contact information

  Scenario: Accessing cart from navigation
    Given I have items in my cart
    When I click on the cart icon
    Then I should be on the cart page
    And I should see my cart items
    And I should see the cart summary

  Scenario: Breadcrumb navigation
    Given I am on the plans page
    When I select a specific plan
    Then I should see breadcrumb navigation
    And I should be able to go back to plans

  Scenario: Mobile navigation menu
    Given I am on a mobile device
    When I click the hamburger menu
    Then I should see the mobile navigation menu
    And I should see all navigation links
    And I should be able to close the menu

  Scenario: Footer navigation
    Given I am on any page
    When I scroll to the footer
    Then I should see footer links
    And I should see social media links
    And I should see company information

  Scenario: Search functionality
    Given I am on the home page
    When I use the search feature
    And I search for "mentoria"
    Then I should see relevant results
    And I should be able to navigate to search results

  Scenario: Back button functionality
    Given I navigate from home to plans to cart
    When I click the browser back button
    Then I should go back to the previous page
    And the page state should be preserved
