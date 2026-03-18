/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 模块联邦类型声明
declare module 'remoteApp/Button' {
  import { DefineComponent } from 'vue';
  const Button: DefineComponent<{}, {}, any>;
  export default Button;
}

declare module 'remoteApp/Header' {
  import { DefineComponent } from 'vue';
  const Header: DefineComponent<{}, {}, any>;
  export default Header;
}

declare module 'remoteApp/Counter' {
  import { DefineComponent } from 'vue';
  const Counter: DefineComponent<{}, {}, any>;
  export default Counter;
}

declare module 'remoteApp/utils' {
  export function formatDate(date: Date): string;
  export function formatCurrency(amount: number): string;
  export const VERSION: string;
}
