import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import "../../styles/Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <p className="pagination-info">
        Page <b>{currentPage}</b> of <b>{totalPages}</b>
      </p>

      <div className="pagination-btns">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pag-nav-btn"
        >
          <LuChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="pag-nav-btn"
        >
          <span>Next</span>
          <LuChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
