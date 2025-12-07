import React from 'react';
import { UserPostCrudWithValidation } from './components/UserPostCrudWithValidation';

export const App58: React.FC = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Prisma with React Hook Form and Zod:</h3>
      <UserPostCrudWithValidation />
    </>
  );
};
