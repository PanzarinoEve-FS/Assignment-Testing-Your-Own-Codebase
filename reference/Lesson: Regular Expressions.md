Regular Expressions, commonly referred to as "regex," is a tool used for pattern matching and text manipulation in programming. They are sequences of characters that define a search pattern, typically used for string-searching algorithms, validation, or text substitution. Regex allows developers to efficiently search, replace, extract, and manipulate text by defining patterns in a concise and flexible way. They are widely supported in most programming languages, including JavaScript.

Regular Expressions work by matching specific patterns within a string, enabling developers to describe complex search patterns with simple rules. This could be anything from checking if an email address is valid, extracting specific portions of a text, or replacing certain patterns within a string. One of the key strengths of regex is its versatility; it can handle everything from simple pattern searches (like finding all instances of a word) to advanced tasks (such as matching an intricate sequence of characters). However, they can be tricky to understand at first because of the compact syntax.

The reason we use Regular Expressions in programming is because of their efficiency and power when dealing with text. Instead of writing complex logic or multiple lines of code to search through strings, validate input formats, or modify text, a single well-written regular expression can perform the task more elegantly. As applications rely more on text processing, input validation, or data extraction, understanding regular expressions becomes essential for developers.

Regex Pattern Tool

Throughout this lesson, I will be using my favorite tool for both interpreting and writing Regex patterns, called Regex101.com. I highly recommend using this tool yourself, just as I’ve done in the screenshots attached to this lesson. You will see an input field at the top, followed by a text box below it. The top input is where you write your pattern, and the text area beneath is where you can type any string to match against the pattern.

Beginning Anchors

Let's first start out with beginning and ending anchors which are the easiest to understand. The caret symbol ^ is used to indicate the start of a string, and the dollar symbol $ is used to indicate the end of a string. Together, they allow you to specify that a pattern must occur at the very beginning or end of a string.

For example, consider the pattern ^Hello. This pattern will match any string that starts with the word "Hello," such as "Hello, World!" but it won't match "Hi, Hello", since "Hello" is not at the beginning.
Beginning anchor Regex pattern match test results. 
Beginning anchor Regex pattern match test results.
Ending Anchors

Conversely, $ is used to check the end of a string. For example, world$ will match any string that ends with "world," such as "Hello world" but won't match "world of coding".

Using these anchors can be incredibly useful for input validation. For example, when validating a username, you might want to ensure that it contains only certain characters and fits the desired length. You can use ^ and $ to ensure the pattern starts and ends in the right way, locking down the text to a strict structure.
Ending anchor Regex pattern match test results. 
Ending anchor Regex pattern match test results.
Using Character Classes and Ranges

Character classes allow you to define sets of characters that can occur in a string. These sets are enclosed in square brackets []. For instance, the pattern [a-z] matches any lowercase letter from 'a' to 'z', and [0-9] matches any digit from 0 to 9. You can combine ranges or characters within a single character class, such as [a-zA-Z0-9], which matches any alphanumeric character (both uppercase and lowercase letters, as well as digits). Take the following example pattern and match test results.
Classes & Character Ranges in Regex pattern match test results. 
Classes & Character Ranges in Regex pattern match test results.
This capability is particularly useful for input validation, where you want to ensure that only certain types of characters are allowed. For instance, in validating a password, you might want to ensure that it contains at least one lowercase letter, one uppercase letter, and one number. Regular expressions make these types of checks relatively easy with character classes.

One thing to remember when using a character class or range in Regular Expressions is that, by default, the class/range applies to only one character. If you want to instruct the Regular Expression to match a specific number of characters, you must use curly braces {X}, where X is the number of characters you want to match. This is called token matching. For example, if you want to match the next three characters/tokens in the pattern, you would use the following expression.
Token matching in Regex test
Token matching in Regex test
Note that you don't have to set a hard value for X. Instead you can specify a range. For example if you want to match the next 3 to 7 characters/tokens then you can use [A-z]{3,7} instead like we have in the following example. 
Class range
Class range
Using Capturing Groups

Groups are a way of capturing portions of the matched string for further use. When you surround part of a regular expression with parentheses (), you create a capture group. This allows you to extract parts of the string that matched a specific part of the pattern.

You can insert almost anything you want inside a capturing group—think of them as nested regular expressions. For instance, if you want to match the next word and place it inside its own group, you can simply use (\w+). Take the following example below.
Matching words using capturing groups
Matching words using capturing groups
Using Regexp Patterns In JavaScript

Regular Expressions could easily be an entire degree program on their own. They can become quite complex, and we've only scratched the surface of the features they support. Ask any developer, and they'll tell you that Regular Expressions can get messy quickly, but they are a necessary evil. It’s one of those skill sets that very few developers truly excel at.

But let's jump into actually using Regular Expressions directly inside of JavaScript. It's simple really. Especially considering that Regular Expressions are considered their own primitive data type entirely. 

Just like the Array class in JavaScript we have access to a class called Regex. We can use this class to test strings against patterns. Just like how we can set a variable to an array using the litteral syntax const arr = [] we can also declare a Regex in the same way using a literal pattern. A Regex literal pattern in JavaScript is noted between two forward slashes. Look at the following example to see how we declare our pattern. 
Javascript
// Star out by typing a code comment with two forward slashes "//"
// but just paste your pattern between the two slashes instead.
const pattern = /^Hello (\w+)!$/
// If you want to actually use the Regex class constructor instead 
// you can simply pass your pattern to the constructor:
// const pattern = new Regexp(/^Hello (\w+)!$/)
// Now we can test any string we want against our pattern object
// by utilizing the .test(str) class method on the Regex class
if( pattern.test("Hello Foo!") ) {
  console.log("String passes the test!")
} else {
  console.log("String failed the test!")
}
That's a Wrap



Phew! As you can see, Regular Expression patterns can become quite complex, and we’ve only scratched the surface. If you’ve had experience with Regular Expressions before this class, you already know how intricate they can get. I’ve only shown you what I consider to be "beginner friendly." It’s worth noting that not many developers are well-versed in reading or writing proper regular expressions—it could be a field of study all on its own.

I highly recommend exploring more on the topic in your own time using the Regex101.com tool. You can also browse many community-written Regular Expressions on the site, where you can quickly grab patterns for things like email, phone numbers, or birthdays.

