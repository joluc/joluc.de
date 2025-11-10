---
title: "Advanced TypeScript Types You Should Know"
date: 2024-02-28T16:20:00+00:00
tags: ["typescript", "javascript", "types", "programming"]
image: "/images/gallery-image.jpg"
---

# Advanced TypeScript Types You Should Know

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TypeScript's type system is incredibly powerful and goes far beyond basic string, number, and boolean types. Understanding advanced types can help you write more robust and maintainable code.

## Union and Intersection Types

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Union types allow a value to be one of several types, while intersection types combine multiple types.

```typescript
// Union Types
type Status = 'loading' | 'success' | 'error';
type StringOrNumber = string | number;

// Intersection Types
interface User {
  name: string;
  email: string;
}

interface Admin {
  permissions: string[];
  lastLogin: Date;
}

type AdminUser = User & Admin;
```

## Conditional Types

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Conditional types allow you to create types that depend on a condition.

```typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { count: T }
  : { data: T };

// Usage
type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { count: number }
type ObjectResponse = ApiResponse<User>; // { data: User }
```

## Mapped Types

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Mapped types allow you to create new types by transforming properties of existing types.

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Example usage
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserUpdate = Partial<User>; // All properties optional
type PublicUser = Pick<User, 'name' | 'email'>; // Only name and email
```

## Template Literal Types

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Template literal types allow you to create types based on string templates.

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts' | '/comments';

type ApiRoute = `${HttpMethod} ${Endpoint}`;
// Result: 'GET /users' | 'GET /posts' | 'GET /comments' |
//         'POST /users' | 'POST /posts' | etc.

// More advanced example
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // 'onClick'
```

## Utility Types

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. TypeScript provides many built-in utility types.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit specific properties
type SafeUser = Omit<User, 'password'>;

// Extract specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Make all properties required
type RequiredUser = Required<Partial<User>>;

// Create a record type
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

## Generic Constraints

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Generic constraints allow you to limit the types that can be used with generics.

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}

// Usage
loggingIdentity('hello'); // OK, string has length
loggingIdentity([1, 2, 3]); // OK, array has length
loggingIdentity({ length: 10, value: 3 }); // OK, object has length
```

## Discriminated Unions

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Discriminated unions help create type-safe union types with a common discriminant property.

```typescript
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState) {
  switch (state.status) {
    case 'loading':
      // TypeScript knows this is LoadingState
      return 'Loading...';
    case 'success':
      // TypeScript knows this is SuccessState
      return state.data;
    case 'error':
      // TypeScript knows this is ErrorState
      return state.error;
  }
}
```

## Best Practices

Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Here are some best practices for using advanced TypeScript types:

1. **Start simple and add complexity as needed**
2. **Use meaningful type names**
3. **Prefer composition over inheritance**
4. **Use utility types when appropriate**
5. **Document complex type definitions**

## Conclusion

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
