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


## Table of Contents
- [Code Style](#code-style)
  - [Style Guide](#style-guide)
  - [Examples](#examples)
    - [Good Example](#good-example)
    - [Bad Example](#bad-example)
  - [Table of Contents](#table-of-contents)
- [JSDoc style guide](#jsdoc-style-guide)
  - [Intro](#intro)
  - [Comments](#comments)
  - [Files](#files)
  - [Modules](#modules)
  - [Functions](#functions)
  - [Classes](#classes)
  - [Constants](#constants)
  - [Links](#links)
  - [Examples](#examples-1)
  - [API](#api)

# JSDoc style guide

Forked from [JSDoc-Style-Guide](https://github.com/shri/JSDoc-Style-Guide)

## Intro

This style guide intends to use the most minimal set of 
JSDoc tags while maintaining a good standard of documentation
for even the largest of codebases. 

JSDoc enables developers to generate documentation from comments
within a Javascript codebase. It also forces a commenting style
throughout a codebase as an added benefit.

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

## Comments

So for JS comments made to explain some parts of the code we will use the format:  

*Single line:*
```js
// Single line comments
```

*Multiple lines:*
```js
/*
Multi-line comments are in this form
*/
```

This is mainly to differentiate between JSDocs documentation and JS comments meant to explain parts of the code.  
As such normal JS comments as seen above are for details/extra explaination included in the code and are different from JSDocs comments which are to document the code.  

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
 
 **EXTERNAL** -- used for External Links, followed by the
 @link tag with a url to the module followed by its
 name in curly braces, e.g. 
 @link{https://github.com/twbs/bootstrap Bootstrap}
 
 **paths** -- used for modules within the codebase, use a 
 path to the module from the root directory of the 
 code base to the module file followed by :module_name
 e.g. /toolbar/api_panel.js:API Panel

## Modules

This will be referring to the module object being exported.  
Thus, the comment will be at where the object is initialized not at where the object is exported
This might also be tagged with the **@class** tag, as the module also acts as a singleton/class.  
Modules can be documented using the **@module** tag in JSDoc.  
```js
/**
 * description of module here
 * @class (may be included sometimes too)
 * @module (Optional module name here, this is as the name is assumed to be name of the variable)
 *
 */
 const moduleObj = {
   ...
 };


module.exports = moduleObj;
...
```

## Functions

Functions use the following comment style in
JSDoc:

```js
/**
 * @function
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

We first tag the function with the **@function** tag.

Then the first line below the **@function** tag in the comment is a succinct
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

Optional tags **@throws** can be used
as well.

**@throws** defines a possible exception:
```js
 *  @throws {exceptionName}
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

## Constants

The comment consist of the **@type** tag followed by a description below the tag.

```js
/**
 * @constant
 * The environment we're running in.
 *
 * @type {string}
 */
 var ENVIRONMENT = "production";
```

## Links

Just in case we need to refer back to copied code.  

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

## API

For the backend server to document what the api does, we can use a **@API** tag:  
```js
/**
 * @API
 * This is the basic problem bulk insert API
 * As for this request, refer to api.md for more deatils.
 * 
 * Expected a json object as part of the request
 * {
 *     data: [
 *         {
 *          taskId, projectId, dueDate, dueTime, duration
 *         }
 *     ],
 * }
 * 
 */
app.post('/basic/insert', [
...
```

For this, we would include a short description of the API followed by a short example of the query/parameters/request body needed/optional with the request.  
