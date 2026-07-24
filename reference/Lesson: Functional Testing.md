Lesson: Functional Testing

Welcome to the final lesson of this class. In this lesson, we will learn the importance of writing functional code tests. Writing functional tests is a great way for developers to ensure consistency and code quality when shipping new code updates. It allows you to test a specific block of code to verify it produces the expected results.

For example, if I’m working on a project’s codebase and update some code inside a function called calculateReturnRate(), then I commit those changes to the repository, which in turn deploys a new release with my updates included in the live production environment. That’s all fine, but what if I accidentally introduced a bug in the updates to that function? I wouldn’t know about the bug until users start flooding in with reports of 'getting rich overnight.' It turns out I used a string instead of a number for one of the variables. Whoops! Now I’m fired, and my company’s reputation is in shambles.

This is the type of scenario functional code testing can prevent. When I committed those changes to the function, instead of automatically deploying the updates live, an internal checklist would run on the code to ensure every function is producing consistent results. This 'checklist' refers to a series of code tests in our case. If the test for my calculateReturnRate() function had failed, the release would have been rejected before ever reaching the live production environment.

What is Jest?

Jest is a popular JavaScript testing framework developed by Facebook, and it's widely used for testing JavaScript applications, including those built with frameworks like React, Node.js, and more. The primary purpose of Jest is to simplify the process of writing and running tests, offering a powerful yet easy-to-use interface for ensuring your code works as intended. One of Jest's key strengths is its ability to run tests in parallel, which speeds up testing and ensures that different pieces of code don't affect each other during execution.

Setting Up Jest Framework

Before diving into writing tests, the first step is to set up Jest in your project. In a Node.js or JavaScript project, installing Jest is straightforward. You can do this using npm:
Bash
$ npm install --save-dev jest
Once installed, you can configure Jest by adding a test script to your package.json file:
Javascript
...
  "scripts": {
    "test": "jest"
  }
...
Writing Our First Test

With Jest installed, running your tests is as simple as executing the command npm test in your terminal. Jest will automatically look for files with the .test.js or .spec.js extension in your project and execute the tests found within those files. Let's start out by creating a new file inside the root directory of our project called index.test.js.

Now let's write our first function code test. Open up your newly created index.test.js file, and copy/paste the code in the example below.
Javascript
function add(a, b) {
  return a + b;
}


In the example above, we defined a simple function called add(), which returns the sum of the variables a and b. What we’re going to do next is write a test for this function. We want to ensure that the input matches the expected output, verifying that nothing unexpected is happening in our function.

To do this, we can define a new test using a global function provided by Jest called test(). The first argument is the title of the test, and the second argument is a function that contains all the code necessary for the test to run.


Javascript
function add(a, b) {
  return a + b
}
test(`Test for function: add(a, b)`, () => {
  
  // Test code goes here.
  const result = add(1, 4) // should be 5
  // Here we are telling Jest that we expect our
  // result variable to be equal to 5
  expect( result ).toBe( 5 )
})
Now that’s not too bad! Pretty simple when you look at it. Jest is a great testing framework because it flows like plain, natural English. The framework is designed in such a way that you can chain each expectation together to form a readable sentence.

More Advanced Matchers

In our previous example, we used the .toBe() method, but that’s just scratching the surface of what’s possible. There are more advanced matchers such as .toBeGreaterThan(), .toBeNull(), and many more. Take a gander at the official documentation on using Jest matchers.

Testing Regular Expressions

What’s interesting is that you can also use a matcher in Jest called .toMatch(), which accepts a Regular Expression to compare a value to. This allows you to test whether a string matches a specific Regular Expression. For example, consider the following case.
Javascript
function getString() {
  return "Foo Bar!"
}
test(`Test for function: getString()`, () => {
  
  expect( getString() ).toMatch( /^Foo Bar!$/ )
})
Testing Exceptions

One last interesting matcher in Jest is the .toThrow() function. This matcher checks whether a function or piece of code throws an exception. By default, it checks if any exception is thrown, but you can also configure it to check for a specific exception by passing the name of the exception as its argument. Pay close attention to the following code, which includes both examples.
Javascript
class InvalidTypeError extends Error {
  constructor() {
    super("A type of string must be passed")
  }
}
class EmptyValueError extends Error  {
  constructor() {
    super("Cannot use an empty string.")
  }
}
function validateInput( str ) {
  if (typeof str !== "string") {
    throw new InvalidTypeError()
  }
  if (str.length === 0) {
    throw new EmptyValueError()
  }
  return str
}
test(`Test for function: validateInput`, () => {
  // If we give validateInput a bool we expect 
  // an InvalidTypeError to be thrown
  expect(() => validateInput( true ))
    .toThrow( InvalidTypeError )
  // If we give validateInput an empty string  we 
  // expect an EmptyValueError to be thrown
  expect(() => validateInput( "" ))
    .toThrow( EmptyValueError  )
  
  // Otherwise lets test our function using 
  // a normal value that doesn't produce an error
  expect(validateInput("Foo Bar!")).toBe("Foo Bar!")
})
One thing to remember when using the .toThrow() matcher in Jest is that you need to wrap the function that throws the exception in its own arrow function, as shown on lines 26 and 31. This is because you want Jest to invoke the function for you, rather than invoking it outside of a try/catch block in your test file.

Well, that’s it, folks! I hope you had fun learning about writing functional code tests.