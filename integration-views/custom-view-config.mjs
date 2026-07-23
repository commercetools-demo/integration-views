/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Integration Views',
  description: 'Rendering additional data, some static, some dynamic.',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',

  env: {
    development: {
      initialProjectKey: 'tech-sales-good-store',
      hostUriPath:
        // '/tech-sales-good-store/orders/9a08bc59-3709-47ab-bae9-6654b85cad08/general',
        '/tech-sales-good-store/customers/691815e7-6129-49fc-b6d3-300709664bec/general',
      // '/tech-sales-good-store/categories/fba234fa-cfc8-4506-ad91-dad0fe97dbc9/general',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  headers: {
    csp: {
      'script-src': ['*.fullstory.com/'],
      'connect-src': ['https://www.google.com/', 'https://api.trello.com'],
      'frame-src': ['https://www.google.com/'],
    },
  },
  oAuthScopes: {
    view: [
      'view_orders',
      'view_customers',
      'view_shopping_lists',
      'view_products',
      'view_types',
    ],
    manage: [
      'manage_orders',
      'manage_shopping_lists',
      'manage_customers',
      'manage_categories',
    ],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: [
    'customers.customer_details.general',
    'orders.order_details.general',
  ],
  labelAllLocales: [{ locale: 'en', value: 'Integration Views' }],
  additionalEnv: {
    googleMapKey: '${env:GOOGLE_MAP_KEY}',
    googleMapOrigin: '${env:GOOGLE_MAP_ORIGIN}',
  },
};

export default config;
