import { lazy } from 'react';

const CustomObjects = lazy(() =>
  import('./custom-objects' /* webpackChunkName: "channels" */)
);

export default CustomObjects;
