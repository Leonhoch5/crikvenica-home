This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Strapi

This frontend can read villa content from a free, self-hosted Strapi instance. If `STRAPI_URL` is not set, the site falls back to the bundled villa data and local images, so the project still runs without a CMS.

To connect Strapi, create a collection type named `villas` with these fields:

- `key` as a short text field, unique, matching `ivanka`, `milka`, or `vesna`
- `name` as a text field
- `bedrooms` as a number field
- `bathrooms` as a number field
- `maxGuests` as a text or number field
- `shortDescription` as a rich text or text field
- `longDescription` as a rich text or text field
- `images` as a multiple media field

Then in Strapi, allow the Public role to `find` and `findOne` for that collection type, publish the entries, and set `STRAPI_URL` in `.env.local` to your Strapi base URL, for example `http://localhost:1337`.

If you want localized villa entries, enable Strapi i18n and create one published entry per locale using the same `key` value. The page will request the locale that is stored in the browser cookie.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
