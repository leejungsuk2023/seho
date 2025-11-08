import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    rules: {
      // Tailwind 4와 JSX 구성 요소가 많아 에러 대신 경고로 완화
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
