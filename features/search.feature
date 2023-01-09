Feature: buying tickets

Scenario: the user selects and books one seat
        Given user is on "/index.php" page
        When user choose 4-th day and movie
        And select 3 row and 4 seat
        Then ticket purchase is confirmed

Scenario: the user selects and books several seats
        Given user is on "/index.php" page
        When user choose 6-th day and movie
        And select 6 row and 7,8 seats
        Then ticket purchase is confirmed        

Scenario: the user trying to select reserved seats
        Given user is on "/index.php" page
        When user choose 4-th day and movie
        And select 4 row and 6 seat
        And user is on "/index.php" page
        When user choose 4-th day and movie
        And trying to select reserved 4 row and 6 seat
        Then booking is not possible