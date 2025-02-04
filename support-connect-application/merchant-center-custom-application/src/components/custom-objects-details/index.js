import { lazy } from 'react';

const CustomObjectsDetails = lazy(() =>
  import('./custom-objects-details' /* webpackChunkName: "custom-objects-details" */)
);

export default CustomObjectsDetails;
