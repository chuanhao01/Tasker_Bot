# Code Style

This documents helps to guide the look and feel of the code so that even when there are multiple developer, the style remains consistent. You may read more about it [here](https://javascript.info/coding-style).

## Style Guide

| Rules             | Choices                         |
| ----------------- | ------------------------------- |
| Case Styles       | camelCase                       |
| Acronym Case      | ibm                             |
| Indentation Style | 1TBS                            |
| Indentation       | Space                           |
| Indentation Space | 4 spaces                        |
| Semicolon         | Mandatory                       |
| File Naming       | camelCase                       |

## Examples

Based on your chosen rules, give an example of a code that follows the code style and an example of a code that does not follow the code style. The examples you give should cover all the above defined rule.

### Good Example

```js
```

### Bad Example

```js
```

## JSDoc style guide

Forked from [JSDoc-Style-Guide](https://github.com/shri/JSDoc-Style-Guide)

## Table of Contents
- [Code Style](#code-style)
  - [Style Guide](#style-guide)
  - [Examples](#examples)
    - [Good Example](#good-example)
    - [Bad Example](#bad-example)
  - [JSDoc style guide](#jsdoc-style-guide)
  - [Table of Contents](#table-of-contents)
  - [Intro](#intro)
  - [Files](#files)
  - [Modules](#modules)
  - [Functions](#functions)
  - [Classes](#classes)
  - [Variables and Constants](#variables-and-constants)
  - [Links](#links)
  - [Examples](#examples-1)

## Intro

This style guide intends to use the most minimal set of 
JSDoc tags while maintaining a good standard of documentation
for even the largest of codebases. 

JSDoc enables developers to generate documentation from comments
within a Javascript codebase. It also forces a commenting style
throughout a codebase as an added benefit.

All JSDoc comments are of the forms:

*Single line:*
```js
/** jsdoc comment here */
```

*Multiple lines:*
```js
/** 
 *  jsdoc comment here
 *  and here
 *  and even here
 */
```

You can mix normal comments in with JSDoc comments throughout
a codebase. At Kimono, we use the double slash // commenting
style for non-JSDoc comments. JSDoc comments are used for 
documentation whereas the // commenting style is leveraged
for detail-oriented notes.

JSDoc leverages tags preceeded with the @ symbol in order to
keep track of relationships within the comments. For example
one can describe a function like this:

```js
/**
 * Takes 2 numbers and returns their sum.
 * @param   {number} a the first number
 * @param   {number} b the second number
 *
 * @returns {number} the sum of a and b
 */
function addNumbers(a, b) {
  return a + b;
}
```
Notice how different types of tags are separated by an empty
comment line. This helps with the readability of JSDoc tags.
Note, the untagged description line isn't separated by an 
empty line from the first tag.

The first * of each line is vertically aligned. The type,
parameter name, and descriptions are vertically aligned
as well.

In the following section, we'll go over how to leverage and
group tags throughout a javascript code base.

## Files

Document the top of files using the following style:
```js
/** 
 *  @fileOverview Write what's going on in the file here.
 *
 *  @author       Shri Ganeshram
 *  @author       Jack Hanford
 *
 *  @requires     NPM:npm_module_1
 *  @requires     BOWER:bower_module_1
 *  @requires     EXTERNAL:@link{http://url.com module_name}
 *  @requires     path/to/file:your_module_2
 */
```
 **@fileOverview** is followed by a simple description of
 the contents of the file. If it's too difficult to fit 
 a description within a line or two, it probably means
 the file needs to be broken into multiple files.
 
 **@author** is followed by the name of an author. To add
 multiple authors, use @author multiple times on 
 separate lines as seen above.
 
 **@requires** uses the source followed by the module name.
 Valid sources include (NPM, BOWER, EXTERNAL, and paths):
 
 **NPM** -- used for NPM modules, followed by :module_name
 
 **BOWER** -- used for Bower modules, followed by :module_name
 
 **EXTERNAL** -- used for External Links, followed by the
 @link tag with a url to the module followed by its
 name in curly braces, e.g. 
 @link{https://github.com/twbs/bootstrap Bootstrap}
 
 **paths** -- used for modules within the codebase, use a 
 path to the module from the root directory of the 
 code base to the module file followed by :module_name
 e.g. /toolbar/api_panel.js:API Panel

## Modules

Modules can be documented using the **@module**
tag in JSDoc:

```js
/**
 * description of module here
 * @module ModuleName
 */

module.exports = new(function () {
...
```

## Functions

Functions use the following comment style in
JSDoc:

```js
/**
 * Takes 2 numbers and returns their sum.
 * @param   {number} a     the first number
 * @param   {number} b     the second number
 * @param   {number} [c=0] the optional third number
 *
 * @returns {number} the sum of a and b
 */
function addNumbers(a, b, c) {
  if (typeof c === "undefined") {
    c = 0;
  }
  return a + b + c;
}
```

The first line in the comment is a succinct
description of what the function does.

The **@param** tag is used to define parameters
the function takes as input. In this case
the function takes 3 parameters, a, b, and c.

The structure of the param tag for a **required
parameter** is:
```js
 *  @param {type} paramname param description
```
'type' is the javascript type of the parameter
which can take values of string, number, boolean,
or Class, where Class represents the type of a
user defined class.

'paramname' is the name of the parameter.

'param description' is a description of what the 
parameter represents.

The structure of an **optional parameter** is the
same with the paramname in square brackets:

```js
 *  @param {type} [paramname] param description
```

The structure of an **optional parameter with a
default value** is the same as an optional 
parameter's with an = followed by the default
value for the param:

```js
 *  @param {type} [paramname=default_value] param description
```

Optional tags **@throws** and **@constructor** can be used
as well.

**@throws** defines a possible exception:
```js
 *  @throws {exceptionName}
```

**@constructor** is used to label functions that
are class constructors:
```js
*  @constructor
```
## Classes

Classes are defined similarly to functions with 
different tags.

```js
/**
 * A class to represent user's cars.
 * @class
 *
 * @constructor
 *
 * @property licensePlate the car's license plate number
 * @property vehicleType  the type of car
 */
function Car(licensePlate) {
  this.licensePlate = licensePlate;
  this.vehicleType = "sedan";
}
```
For classes, we use the first line to provide
a description of the class.

The **@class** tag is used to label the function
as a class.

The **@constructor** tag is used to label the 
function as a constructor for the class.

The **@property** tag is used to define class 
properties and is followed by the property name
and the description of the property.

## Variables and Constants

Variables can be documented using JSDoc. 
For example:

```js
/**
 * The current environment we're running in.
 * @type {string}
 */
 var currentEnvironment = getEnvironment();
```
The comment consists of a description in the 
first line followed by a **@type** tag in the 
second line.

Constants can be documented the same way as 
variables except with a **@constant** tag:

```js
/**
 * The environment we're running in.
 * @constant
 *
 * @type {string}
 */
 var ENVIRONMENT = "production";
```

## Links

External links can be used in various comments
by using the **@link** tag:

```js
/** Stolen from {http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript Stackoverflow Levenshtein Distance}*/
```
The **@link** tag is followed by the url and its
caption in curly braces.

## Examples

To include an example in the code base, use the 
**@example** tag:

```js
/**
 * Takes 2 numbers and returns their sum.
 * @example 
 * var a = 5,
 *     b = 6;
 *
 * var sum = addNumbers(5, 6); // sum is set to 11
 *
 * @param   {number} a the first number
 * @param   {number} b the second number
 *
 * @returns {number} the sum of a and b
 */
function addNumbers(a, b) {
  return a + b;
}
```

Use the **@example** tag within the comment block
used to define a function, class, or constructor.
