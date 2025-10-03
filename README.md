# NEST Project

A NestJS-based backend for an NFT marketplace.

## 📁 Project Structure

<details>
<summary><strong>🗂️ nft-marketplace-backend</strong></summary>

<details>
<summary><strong>📂 src/</strong></summary>

<details>
<summary><strong>📂 config/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `config.ts` - Application configuration and environment setup

</details>

<details>
<summary><strong>📂 DbConfig/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `db.module.ts` - Database configuration and connection setup

</details>

<details>
<summary><strong>📂 interceptors/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `file-cleanup.interceptor.ts` - HTTP interceptors for file cleanup

</details>

<details>
<summary><strong>📂 customDecorators/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- Custom NestJS decorators for enhanced functionality

</details>

<details>
<summary><strong>📂 mail/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `mail.service.ts` - Email sending service  
&nbsp;&nbsp;&nbsp;&nbsp;- `mail.module.ts` - Email module configuration

</details>

<details>
<summary><strong>📂 utils/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- Utility functions and helpers for common operations

</details>

<details>
<summary><strong>📂 admin/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `admin.controller.ts` - Admin API endpoints  
&nbsp;&nbsp;&nbsp;&nbsp;- `admin.service.ts` - Admin business logic  
&nbsp;&nbsp;&nbsp;&nbsp;- `admin.module.ts` - Admin module configuration

</details>

<details>
<summary><strong>📂 auth/</strong></summary>

<details>
<summary><strong>📂 models/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- user database schemas and data models

</details>

<details>
<summary><strong>📂 dto/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `create-user.dto.ts` - user creation DTO  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `mint-nft.dto.ts` -  Update user DTO

</details>

&nbsp;&nbsp;&nbsp;&nbsp;- `auth.controller.ts` - Authentication endpoints  
&nbsp;&nbsp;&nbsp;&nbsp;- `auth.service.ts` - Authentication logic  
&nbsp;&nbsp;&nbsp;&nbsp;- `auth.module.ts` - Auth module setup  
&nbsp;&nbsp;&nbsp;&nbsp;- `auth.guard.ts` - JWT authentication guard

</details>

<details>
<summary><strong>📂 users/</strong></summary>

<details>
<summary><strong>📂 models/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- User database schemas and data models

</details>

<details>
<summary><strong>📂 dto/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `create-user.dto.ts` - user creation DTO  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `update-user.dto.ts` - update user DTO

</details>

&nbsp;&nbsp;&nbsp;&nbsp;- `users.controller.ts` - User API endpoints  
&nbsp;&nbsp;&nbsp;&nbsp;- `users.service.ts` - User business logic  
&nbsp;&nbsp;&nbsp;&nbsp;- `users.module.ts` - User module configuration  
&nbsp;&nbsp;&nbsp;&nbsp;- `user.entity.ts` - User data model

</details>

<details>
<summary><strong>📂 nfts/</strong></summary>

<details>
<summary><strong>📂 models/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- NFT database schemas and data models

</details>

<details>
<summary><strong>📂 dto/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `create-nft.dto.ts` - NFT creation DTO  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- `mint-nft.dto.ts` - NFT minting DTO

</details>

<details>
<summary><strong>📂 eventsMethods/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Blockchain event handlers and processors

</details>

<details>
<summary><strong>📂 eventTracker/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Real-time event tracking and monitoring

</details>

&nbsp;&nbsp;&nbsp;&nbsp;- `nfts.controller.ts` - NFT API endpoints  
&nbsp;&nbsp;&nbsp;&nbsp;- `nfts.service.ts` - NFT business logic  
&nbsp;&nbsp;&nbsp;&nbsp;- `nfts.module.ts` - NFT module configuration

</details>

<details>
<summary><strong>📂 abis/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `mediaAbi.ts` - Media contract ABI  
&nbsp;&nbsp;&nbsp;&nbsp;- `mintAbi.ts` - Minting contract ABI

</details>

<details>
<summary><strong>📂 contractInstance/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- Blockchain contract instances and interactions  
&nbsp;&nbsp;&nbsp;&nbsp;- Contract service providers

</details>

<details>
<summary><strong>📂 chat/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- `chat.gateway.ts` - WebSocket gateway  
&nbsp;&nbsp;&nbsp;&nbsp;- `chat.module.ts` - Chat module configuration

</details>

&nbsp;&nbsp;&nbsp;&nbsp;- `app.controller.ts` - Main application controller  
&nbsp;&nbsp;&nbsp;&nbsp;- `app.module.ts` - Root application module  
&nbsp;&nbsp;&nbsp;&nbsp;- `app.service.ts` - Main application service  
&nbsp;&nbsp;&nbsp;&nbsp;- `main.ts` - Application entry point

</details>

<details>
<summary><strong>📂 test/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- Test files and configurations

</details>

<details>
<summary><strong>📂 uploads/</strong></summary>

&nbsp;&nbsp;&nbsp;&nbsp;- Temporary file storage for NFT media uploads

</details>

&nbsp;&nbsp;&nbsp;&nbsp;- `.env` - Environment variables  
&nbsp;&nbsp;&nbsp;&nbsp;- `.env.example` - Environment variables template  
&nbsp;&nbsp;&nbsp;&nbsp;- `.gitignore` - Git ignore rules  
&nbsp;&nbsp;&nbsp;&nbsp;- `.prettierrc` - Code formatting configuration  
&nbsp;&nbsp;&nbsp;&nbsp;- `eslint.config.mjs` - ESLint configuration  
&nbsp;&nbsp;&nbsp;&nbsp;- `nest-cli.json` - NestJS CLI configuration  
&nbsp;&nbsp;&nbsp;&nbsp;- `package.json` - Project dependencies and scripts  
&nbsp;&nbsp;&nbsp;&nbsp;- `package-lock.json` - Dependency lock file  
&nbsp;&nbsp;&nbsp;&nbsp;- `README.md` - Project documentation  
&nbsp;&nbsp;&nbsp;&nbsp;- `tsconfig.json` - TypeScript configuration  
&nbsp;&nbsp;&nbsp;&nbsp;- `tsconfig.build.json` - TypeScript build configuration

</details>