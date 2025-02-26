/**
 * Navigation.js
 * React component for providing consistent navigation across the application.
 * Includes links to the Dashboard, Credentials, Group URLs, and Logs sections.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css'; // Import styles specific to the Navigation component

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'navigation-link active' : 'navigation-link')}
          >
            Dashboard
          </NavLink>
        </li>
        <li className="navigation-item">
          <NavLink
            to="/credentials"
            className={({ isActive }) => (isActive ? 'navigation-link active' : 'navigation-link')}
          >
            Credentials
          </NavLink>
        </li>
        <li className="navigation-item">
          <NavLink
            to="/group-urls"
            className={({ isActive }) => (isActive ? 'navigation-link active' : 'navigation-link')}
          >
            Group URLs
          </NavLink>
        </li>
        <li className="navigation-item">
          <NavLink
            to="/logs"
            className={({ isActive }) => (isActive ? 'navigation-link active' : 'navigation-link')}
          >
            Logs
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
```

### Explanation of the Implementation

1. **Component Structure**:
   - The `Navigation` component provides a consistent navigation bar for the application.
   - It uses the `NavLink` component from `react-router-dom` to enable navigation between routes.

2. **Styling**:
   - The component imports a CSS file (`Navigation.css`) for styling. This ensures that the styles are scoped to the `Navigation` component.
   - Active links are styled differently using the `isActive` property provided by `NavLink`.

3. **Navigation Links**:
   - The navigation bar includes links to the Dashboard, Credentials, Group URLs, and Logs sections.
   - Each link dynamically applies the `active` class when the corresponding route is active.

4. **Accessibility**:
   - The navigation bar is implemented as an unordered list (`<ul>`), with each link wrapped in a list item (`<li>`), ensuring semantic HTML and better accessibility.

### Review Checklist
- **Purpose Fulfilled**: The component provides consistent navigation across the application, as required.
- **Conventions Followed**: The code uses React functional components, `react-router-dom` for navigation, and scoped CSS for styling, consistent with the codebase.
- **Completeness**: The file is fully functional, with no placeholders or incomplete code.
- **Error Handling**: Not applicable for this component, as it is a static interface.
- **Styling**: The component is styled using a dedicated CSS file (`Navigation.css`), ensuring maintainability and consistency.
