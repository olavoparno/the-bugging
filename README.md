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

> P.S.: This is only for web projects as it heavyly depends on the window.
> P.S.2: It is SSR ready for projects using Next.js.

---

## Installation

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

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## License

Istanbul Badges Readme is [MIT licensed](./LICENSE).
