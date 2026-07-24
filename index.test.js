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

function getString() {
  return "Foo Bar!"
}
test(`Test for function: getString()`, () => {
  
  expect( getString() ).toMatch( /^Foo Bar!$/ )
})

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