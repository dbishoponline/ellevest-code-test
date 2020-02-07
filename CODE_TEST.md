# Ellevest Take Home
Thank you for your interest in Ellevest! For this exercise, you'll be working to build part of a "Venmo-like" system of payments between users. In Part I you'll build the data for a "social" payments feed. In Part II, you'll implement a method for sending a new payment through the API. The API referenced above provides endpoints for Transfers, Accounts, Users, and Likes and includes all the information you'll need to successfully complete this exercise. While not truly "live" this API supports GET, POST, and PUT operations for all resources.

This exercise uses an API, please review the documentation here. The base URL for the API is https://dylan-takehome.glitch.me. As an example, the Transfers API endpoint would be https://dylan-takehome.glitch.me/transfers.

You may use the language of your choice for this exercise and include any additional libraries you require to complete the task. Your implementation should have valid syntax and be executable. No need to spend more than two hours working on the exercise – it's alright if you have not completed both parts within that time frame. When you're done, please email people@ellevest.com with your attached solution. Please reach out using the same email address if you have any questions or concerns.

Here at Ellevest we value testable, modular, and clean code. Please treat this exercise as if it's production code and part of a larger system. Consider how your code would fit into the broader context of an application.

Be prepared to discuss the trade-offs you made in your implementation and to participate in a peer code-review discussion.

## Part I
Using the API, implement a method to build the data for a "social" transfers feed, combining information from whichever API resources are necessary. Transfers with a "failed" status should be excluded from the feed. Your method should return an Array of Objects (Hashes, Dictionaries, etc.) with the following information:



[
  {
    "originUserName": "John Smith",         // Full name of User associated with origin Account
    "targetUserName": "Sallie Someone",     // Full name of User associated with target Account
    "amount": 54.99,                        // Amount in dollars
    "description": "For drinks and dinner", // Transfer description
    "likesCount": 2                         // Number of likes for this Transfer
  },
  ...
]



## Part II
Using the API, implement a method to create a new Transfer between two accounts. This method should take arguments corresponding to the attributes of the Transfer resource. Before creating the Transfer, your method should confirm that the funds are available in the origin Account. Assume the API will handle updating related resources or return an error if there was failure. Here's an example of input data:



{
  "originAccount": 3,
  "targetAccount": 1,
  "amount": 1230,
  "description": "Thanks for the laughs!",
  "status": "initiated",
  "initiatedAt": "2019-05-30T12:53:38-04:00" // For an extra challenge, set this value to the current time
}



This method should output the response from the Transfers API. For example:



{
  "id": 4,
  "status": "initiated",
  "originAccount": 3,
  "targetAccount": 1,
  "amount": 1230,
  "description": "Thanks for the laughs!",
  "initiatedAt": "2019-05-30T12:53:38-04:00",
  "completedAt": null,
  "failedAt": null
}



This exercise uses JSON Server.




// {
//     "id": 1,
//     "firstName": "Aaron",
//     "lastName": "Howard",
//     "accounts": [
//       1,
//       2
//     ],
//     "transfers": [
//       1,
//       2,
//       3
//     ],
//     "likes": [
//       4
//     ]
//   },

// {
//     "id": 1,
//     "status": "complete",
//     "originAccount": 1,
//     "targetAccount": 4,
//     "amount": 10000,
//     "description": "Consider us even >:|",
//     "initiatedAt": "2019-05-20T12:53:38-04:00",
//     "completedAt": "2019-05-22T12:00:00-04:00",
//     "failedAt": null
//   },

  // [
  //   {
  //     "originUserName": "John Smith",         // Full name of User associated with origin Account
  //     "targetUserName": "Sallie Someone",     // Full name of User associated with target Account
  //     "amount": 54.99,                        // Amount in dollars
  //     "description": "For drinks and dinner", // Transfer description
  //     "likesCount": 2                         // Number of likes for this Transfer
  //   },
  //   ...
  // ]