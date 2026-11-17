import { useMemo, useState } from "react";

export const usePagination = (perPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryVariables = useMemo(
    () => ({
      limit: perPage,
      offset: (currentPage - 1) * perPage,
    }),
    [perPage, currentPage],
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    currentPage,
    queryVariables,
    handlePageChange,
  };
};
