# `PeerPrep`'s frontend

## Workflows

In the project directory `frontend/`, you can run:

### `npm start`

Runs the app in the development mode. You can set the port number in the `.env` file. By default, we use 3000. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Some design choices

<details>
<summary><b>Use of React</b></summary>
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more details.
</details>
<details>
<br/>
<summary><b>Use of TypeScript</b> </summary>
<br>
Some concent
</details>

## Some key concepts

<details>
<summary> JSX and TSX </summary>
<br>

`.jsx` and `.tsx` files provide syntactic sugar for creating specific JavaScript objects, reducing verbosity. In our use case, as specified in `tsconfig.json`, we are using React to interpret these elements. So when we write:

```
const tag = <h1>Hello</h1>
```

We are essentially doing:

```
const tag = React.createElement("h1", {}, "Hello")
```

And under the hood, `React.createElement` simply creates a plain JavaScript object.

</details>
<details>
<summary> How the React Renderer works </summary>
<br>

Taken from [here](https://www.freecodecamp.org/news/react-under-the-hood/).

### Decoupling objects and rendering

At its core, React basically maintains a tree, and in doing so, it allows us to effectively reconstruct the DOM (the rendered HTML on the browser) in JavaScript and push only the changes that have occured (by traversing down said tree).

When we use `.jsx` or `.tsx` files (or manually create React elements), we essentially create a huge, nested object. How do we then create actual HTML tags out of it?

The main idea is that the ReactDOM recusirvely traverses the object and creates nodes based on their `type` property and appends them to the DOM.

A key thing is to observe that the ReactDOM is decoupled from React - that is, the ReactDOM renders (i.e. converts to HTML) the React element. In doing so, for different platforms, we could use different renderers. [React Native](), for example, is a different renderer that runs natively on the host OS.

### Lazy re-rendering by the React DOM

React essentially maintains a JavaScript version of the DOM and uses it to
"diff" what is newly-rendered (upon some change), and decide what to then push to the actual DOM.

Because recursively diffing would be expensive, the assumption is made that if a parent has changed, its containing subtree has changed - so a recursive re-render would be done downwards.

### How the React DOM identifies nodes: keys

At this point, it's worth thinking about how exactly React efficiently does a diff - and the idea lies in keys! That is, on a change, the _key_ of an element changes - this allows the renderer to check whether the keys match, rather than iterating through specific attributes.
The below way is an efficient way of performing the same thing:

```
    <li key="A">A</li>
    <li key="B">B</li>
```

Now, if this gets changed to:

```
    <li key="Z">Z</li>
    <li key="A">A</li>
    <li key="B">B</li>
```

React would now know that keys 'A' and 'B' already exists, so we just need to add the new element with key 'Z'.

</details>
