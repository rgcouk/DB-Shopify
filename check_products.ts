import { createStorefrontClient } from '@shopify/hydrogen';

const client = createStorefrontClient({
  privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
  publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN,
  storeDomain: process.env.PUBLIC_STORE_DOMAIN,
  storefrontApiVersion: '2024-01',
});

const query = `
  query {
    products(first: 50) {
      nodes {
        title
        productType
        tags
      }
    }
  }
`;

async function main() {
  const response = await client.query(query);
  console.log(JSON.stringify(response.data.products.nodes, null, 2));
}

main();
