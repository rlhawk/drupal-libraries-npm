# drupal-libraries-npm

This is an example of one method to manage third-party libraries in Drupal 8. Packages with files that will be used as-is in the web application are defined as Node dependencies in package.json. The necessary files are copied using a script called "copy," with the actual copying being done by copy-files-from-to, which is a dev dependency. The definition for which files will be copied and to where is contained in the copy-files-from-to.json file.

There is a custom module called "Example Libraries" that defines Drupal asset libraries for the third-party libraries. Another custom module called "Example Module" demonstrates how a module can use the libraries defined by Example Libraries.

There is also a custom theme called "Example Theme," which shows how webfont files can be copied to the theme directory for use by the theme.

## Give it a try

From the project root:

- `npm install`
- `npm run copy`
