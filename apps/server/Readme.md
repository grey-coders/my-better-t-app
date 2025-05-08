# Installation Instructions

To set up the server side, you need to install the following dependencies:

### Testing Dependencies
Install Jest and related packages for testing:
```bash
npm install --save-dev jest ts-jest @babel/preset-env @types/jest
```

### Prisma Client
Set up Prisma Client by running the following commands:
```bash
pnpx @better-auth/cli@latest generate
npx prisma generate #For setting up better auth client ?
pnpm prisma generate
```


### Bcrypt Dependencies
Install `bcryptjs` and its type definitions:
```bash
npm install bcryptjs @types/bcryptjs
```


Make sure to configure `ts-jest`, Jest, and Prisma in your project as needed.


### Resolving ESM/CommonJS Issues

If you encounter issues related to ESM or CommonJS modules, ensure your `tsconfig.json` is properly configured. Below is an example configuration:

```json
***tsconfig.json***

{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJs",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "verbatimModuleSyntax": false,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    },
    "outDir": "./dist",
    "types": [
        "node", "jest"
    ],
    "jsx": "react-jsx"
  },
  "tsc-alias": {
    "resolveFullPaths": true
  }
}

```

Make sure to adjust the `module` and `target` fields based on your project's requirements. This configuration should help resolve most compatibility issues.