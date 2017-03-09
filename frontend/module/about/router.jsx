import C1 from './component/c1.jsx';
import C2 from './component/c2.jsx';
import About from './about.jsx';

let r1 = {
  path: 'c1',
  component: C1
};

let r2 = {
  path: 'c2',
  component: C2
};

let myRoute = {
  path: 'about',
  childRoutes: [
    r1,
    r2
  ],
  indexRoute: {component: C1},
  component: About
};

export default myRoute;