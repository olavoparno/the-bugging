# the-bugging

> TheBugging is a simple and lightweight library for logging and debugging your code.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Contributors](#contributors)
- [License](#license)

---

## Requirements

- Grab your _projectKey_ at [www.thebugging.com](https://www.thebugging.com).

> P.S.: This is only for web projects as it heavyly depends on the DOM window.

> P.S.2: It is SSR ready for projects using Next.js but still only meant to be run on the client.

---

## Installation

- First, add the dependency to your project

```bash
  npm install the-bugging
```

- Or alternatively, with yarn:

```bash
  yarn add the-bugging
```

- With a valid _projectKey_, simply start at the very top of your web project like so:

```tsx
import TheBugging from "the-bugging";

TheBugging.init({ projectKey: "VALID-PROJECT-KEY" });
```

- Create React App index.jsx:

```jsx
import { createRoot } from "react-dom/client";
import TheBugging from "the-bugging";
import App from "./App";

TheBugging.init({ projectKey: "VALID-PROJECT-KEY" });

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(<App />);
```

- Next.js \_app.jsx

```jsx
import TheBugging from "the-bugging";

function MyApp({ Component, pageProps }) {
  TheBugging.init({ projectKey: "VALID-PROJECT-KEY" });

  return <Component {...pageProps} />;
}

export default MyApp;
```

---

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://olavoparno.vercel.app/"><img src="https://avatars.githubusercontent.com/u/7513162?v=4?s=70" width="70px;" alt="Olavo Parno"/><br /><sub><b>Olavo Parno</b></sub></a><br /><a href="#ideas-olavoparno" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/olavoparno/the-bugging/commits?author=olavoparno" title="Code">💻</a> <a href="https://github.com/olavoparno/the-bugging/commits?author=olavoparno" title="Documentation">📖</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## License

Istanbul Badges Readme is [MIT licensed](./LICENSE).
